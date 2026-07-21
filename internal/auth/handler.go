package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"net/mail"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

const (
	sessionCookie = "tpg_session"
	maxBodyBytes  = 16 << 10
)

type Handler struct {
	store     Store
	config    Config
	now       func() time.Time
	limiter   *loginLimiter
	dummyHash []byte
}

func NewHandler(store Store, cfg Config) *Handler {
	if cfg.SessionTTL == 0 {
		cfg.SessionTTL = 7 * 24 * time.Hour
	}
	if cfg.BcryptCost == 0 {
		cfg.BcryptCost = 12
	}
	dummyHash, _ := bcrypt.GenerateFromPassword([]byte("not-a-real-user-password"), cfg.BcryptCost)
	return &Handler{store: store, config: cfg, now: time.Now, limiter: newLoginLimiter(8, 15*time.Minute), dummyHash: dummyHash}
}

func (h *Handler) Routes(staticDir string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/auth/signup", h.signup)
	mux.HandleFunc("POST /api/auth/login", h.login)
	mux.HandleFunc("POST /api/auth/logout", h.logout)
	mux.HandleFunc("GET /api/auth/me", h.me)
	files := http.FileServer(http.Dir(staticDir))
	mux.Handle("GET /assets/", files)
	mux.Handle("GET /images/", files)
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, staticDir+"/index.html")
	})
	return securityHeaders(mux)
}

type credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) signup(w http.ResponseWriter, r *http.Request) {
	if !h.validOrigin(r) {
		writeError(w, http.StatusForbidden, "invalid request origin")
		return
	}
	input, ok := decodeCredentials(w, r)
	if !ok {
		return
	}
	email, err := normalizeEmail(input.Email)
	if err != nil {
		writeError(w, http.StatusBadRequest, "enter a valid email address")
		return
	}
	if err := validatePassword(input.Password); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), h.config.BcryptCost)
	if err != nil {
		log.Printf("hash password: %v", err)
		writeError(w, 500, "unable to create account")
		return
	}
	user, err := h.store.CreateUser(r.Context(), email, string(hash))
	if errors.Is(err, ErrEmailExists) {
		writeError(w, http.StatusConflict, "an account with this email already exists")
		return
	}
	if err != nil {
		log.Printf("create user: %v", err)
		writeError(w, 500, "unable to create account")
		return
	}
	if err := h.startSession(w, r, user.ID); err != nil {
		log.Printf("create session: %v", err)
		writeError(w, 500, "account created; please log in")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"user": user})
}

func (h *Handler) login(w http.ResponseWriter, r *http.Request) {
	if !h.validOrigin(r) {
		writeError(w, http.StatusForbidden, "invalid request origin")
		return
	}
	key := clientIP(r)
	if !h.limiter.allow(key, h.now()) {
		w.Header().Set("Retry-After", "900")
		writeError(w, http.StatusTooManyRequests, "too many login attempts; try again later")
		return
	}
	input, ok := decodeCredentials(w, r)
	if !ok {
		return
	}
	email, err := normalizeEmail(input.Email)
	if err != nil {
		h.invalidCredentials(w)
		return
	}
	user, err := h.store.UserByEmail(r.Context(), email)
	hash := []byte(user.PasswordHash)
	if err != nil {
		hash = h.dummyHash
	}
	passwordErr := bcrypt.CompareHashAndPassword(hash, []byte(input.Password))
	if err != nil || passwordErr != nil {
		h.limiter.fail(key, h.now())
		h.invalidCredentials(w)
		return
	}
	h.limiter.success(key)
	if err := h.startSession(w, r, user.ID); err != nil {
		log.Printf("create session: %v", err)
		writeError(w, 500, "unable to log in")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": user})
}

func (h *Handler) logout(w http.ResponseWriter, r *http.Request) {
	if !h.validOrigin(r) {
		writeError(w, http.StatusForbidden, "invalid request origin")
		return
	}
	if token, ok := sessionToken(r); ok {
		hash := sha256.Sum256([]byte(token))
		if err := h.store.DeleteSession(r.Context(), hash[:]); err != nil {
			log.Printf("delete session: %v", err)
		}
	}
	h.clearCookie(w)
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
	token, ok := sessionToken(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	hash := sha256.Sum256([]byte(token))
	user, err := h.store.UserBySession(r.Context(), hash[:], h.now())
	if errors.Is(err, pgx.ErrNoRows) {
		h.clearCookie(w)
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	if err != nil {
		log.Printf("read session: %v", err)
		writeError(w, 500, "unable to read session")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": user})
}

func (h *Handler) startSession(w http.ResponseWriter, r *http.Request, userID string) error {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return err
	}
	token := base64.RawURLEncoding.EncodeToString(raw)
	hash := sha256.Sum256([]byte(token))
	expires := h.now().Add(h.config.SessionTTL)
	if err := h.store.CreateSession(r.Context(), userID, hash[:], expires); err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{Name: sessionCookie, Value: token, Path: "/", HttpOnly: true, Secure: h.config.CookieSecure, SameSite: http.SameSiteLaxMode, Expires: expires, MaxAge: int(h.config.SessionTTL.Seconds())})
	return nil
}

func (h *Handler) clearCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{Name: sessionCookie, Path: "/", HttpOnly: true, Secure: h.config.CookieSecure, SameSite: http.SameSiteLaxMode, MaxAge: -1, Expires: time.Unix(1, 0)})
}

func (h *Handler) invalidCredentials(w http.ResponseWriter) {
	writeError(w, http.StatusUnauthorized, "invalid email or password")
}

func (h *Handler) validOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	}
	want := h.config.AllowedOrigin
	if want == "" {
		want = "http://" + r.Host
		if r.TLS != nil {
			want = "https://" + r.Host
		}
	}
	a, errA := url.Parse(origin)
	b, errB := url.Parse(want)
	return errA == nil && errB == nil && subtle.ConstantTimeCompare([]byte(strings.ToLower(a.Scheme+"://"+a.Host)), []byte(strings.ToLower(b.Scheme+"://"+b.Host))) == 1
}

func decodeCredentials(w http.ResponseWriter, r *http.Request) (credentials, bool) {
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
	defer r.Body.Close()
	var input credentials
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON request")
		return input, false
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		writeError(w, http.StatusBadRequest, "request must contain one JSON object")
		return input, false
	}
	return input, true
}

func normalizeEmail(raw string) (string, error) {
	email := strings.ToLower(strings.TrimSpace(raw))
	if len(email) > 254 {
		return "", errors.New("email too long")
	}
	address, err := mail.ParseAddress(email)
	if err != nil || address.Address != email || !strings.Contains(email, ".") {
		return "", errors.New("invalid email")
	}
	return email, nil
}

func validatePassword(password string) error {
	if len(password) < 12 {
		return errors.New("password must contain at least 12 characters")
	}
	if len(password) > 72 {
		return errors.New("password must contain no more than 72 characters")
	}
	return nil
}

func sessionToken(r *http.Request) (string, bool) {
	cookie, err := r.Cookie(sessionCookie)
	return func() (string, bool) {
		if err != nil || cookie.Value == "" {
			return "", false
		}
		return cookie.Value, true
	}()
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		return host
	}
	return r.RemoteAddr
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		if strings.HasPrefix(r.URL.Path, "/api/") {
			w.Header().Set("Cache-Control", "no-store")
		}
		next.ServeHTTP(w, r)
	})
}

type loginAttempt struct {
	count int
	reset time.Time
}
type loginLimiter struct {
	mu       sync.Mutex
	attempts map[string]loginAttempt
	max      int
	window   time.Duration
}

func newLoginLimiter(max int, window time.Duration) *loginLimiter {
	return &loginLimiter{attempts: make(map[string]loginAttempt), max: max, window: window}
}
func (l *loginLimiter) allow(key string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	a := l.attempts[key]
	return now.After(a.reset) || a.count < l.max
}
func (l *loginLimiter) fail(key string, now time.Time) {
	l.mu.Lock()
	defer l.mu.Unlock()
	a := l.attempts[key]
	if now.After(a.reset) {
		a = loginAttempt{reset: now.Add(l.window)}
	}
	a.count++
	l.attempts[key] = a
}
func (l *loginLimiter) success(key string) { l.mu.Lock(); defer l.mu.Unlock(); delete(l.attempts, key) }
