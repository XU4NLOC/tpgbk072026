package auth

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

type memorySession struct {
	userID  string
	expires time.Time
}
type memoryStore struct {
	users    map[string]User
	sessions map[[32]byte]memorySession
}

func newMemoryStore() *memoryStore {
	return &memoryStore{users: map[string]User{}, sessions: map[[32]byte]memorySession{}}
}
func (s *memoryStore) CreateUser(_ context.Context, email, hash string) (User, error) {
	if _, exists := s.users[email]; exists {
		return User{}, ErrEmailExists
	}
	u := User{ID: "user-1", Email: email, PasswordHash: hash, CreatedAt: time.Now()}
	s.users[email] = u
	return u, nil
}
func (s *memoryStore) UserByEmail(_ context.Context, email string) (User, error) {
	u, ok := s.users[email]
	if !ok {
		return User{}, ErrNotFound
	}
	return u, nil
}
func (s *memoryStore) CreateSession(_ context.Context, userID string, hash []byte, expires time.Time) error {
	var key [32]byte
	copy(key[:], hash)
	s.sessions[key] = memorySession{userID, expires}
	return nil
}
func (s *memoryStore) UserBySession(_ context.Context, hash []byte, now time.Time) (User, error) {
	var key [32]byte
	copy(key[:], hash)
	session, ok := s.sessions[key]
	if !ok || !session.expires.After(now) {
		return User{}, ErrNotFound
	}
	for _, u := range s.users {
		if u.ID == session.userID {
			return u, nil
		}
	}
	return User{}, ErrNotFound
}
func (s *memoryStore) DeleteSession(_ context.Context, hash []byte) error {
	var key [32]byte
	copy(key[:], hash)
	delete(s.sessions, key)
	return nil
}

func testHandler(store Store) http.Handler {
	return NewHandler(store, Config{SessionTTL: time.Hour, BcryptCost: 4, AllowedOrigin: "https://example.com", CookieSecure: true}).Routes()
}

func jsonRequest(t *testing.T, handler http.Handler, method, path string, body any, cookie *http.Cookie) *httptest.ResponseRecorder {
	t.Helper()
	payload, _ := json.Marshal(body)
	req := httptest.NewRequest(method, path, bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "https://example.com")
	if cookie != nil {
		req.AddCookie(cookie)
	}
	res := httptest.NewRecorder()
	handler.ServeHTTP(res, req)
	return res
}

func TestSignupSessionAndLogoutFlow(t *testing.T) {
	store := newMemoryStore()
	handler := testHandler(store)
	res := jsonRequest(t, handler, http.MethodPost, "/api/auth/signup", credentials{Email: " Person@Example.COM ", Password: "a secure password"}, nil)
	if res.Code != http.StatusCreated {
		t.Fatalf("signup status = %d, body=%s", res.Code, res.Body.String())
	}
	if store.users["person@example.com"].PasswordHash == "a secure password" {
		t.Fatal("password was stored in plaintext")
	}
	cookies := res.Result().Cookies()
	if len(cookies) != 1 || !cookies[0].HttpOnly || !cookies[0].Secure || cookies[0].SameSite != http.SameSiteLaxMode {
		t.Fatalf("unexpected session cookie: %#v", cookies)
	}
	hash := sha256.Sum256([]byte(cookies[0].Value))
	if _, ok := store.sessions[hash]; !ok {
		t.Fatal("server did not store hashed session token")
	}

	me := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	req.AddCookie(cookies[0])
	handler.ServeHTTP(me, req)
	if me.Code != http.StatusOK {
		t.Fatalf("me status = %d", me.Code)
	}

	logout := jsonRequest(t, handler, http.MethodPost, "/api/auth/logout", nil, cookies[0])
	if logout.Code != http.StatusNoContent || len(store.sessions) != 0 {
		t.Fatalf("logout failed: status=%d sessions=%d", logout.Code, len(store.sessions))
	}
}

func TestLoginAndValidation(t *testing.T) {
	store := newMemoryStore()
	handler := testHandler(store)
	jsonRequest(t, handler, http.MethodPost, "/api/auth/signup", credentials{Email: "person@example.com", Password: "a secure password"}, nil)

	bad := jsonRequest(t, handler, http.MethodPost, "/api/auth/login", credentials{Email: "person@example.com", Password: "wrong password"}, nil)
	missing := jsonRequest(t, handler, http.MethodPost, "/api/auth/login", credentials{Email: "missing@example.com", Password: "wrong password"}, nil)
	if bad.Code != http.StatusUnauthorized || bad.Body.String() != missing.Body.String() {
		t.Fatalf("login errors reveal account existence: %q vs %q", bad.Body.String(), missing.Body.String())
	}
	short := jsonRequest(t, handler, http.MethodPost, "/api/auth/signup", credentials{Email: "new@example.com", Password: "short"}, nil)
	if short.Code != http.StatusBadRequest {
		t.Fatalf("short password status = %d", short.Code)
	}
	good := jsonRequest(t, handler, http.MethodPost, "/api/auth/login", credentials{Email: "person@example.com", Password: "a secure password"}, nil)
	if good.Code != http.StatusOK {
		t.Fatalf("login status = %d body=%s", good.Code, good.Body.String())
	}
}

func TestRejectsCrossSiteMutation(t *testing.T) {
	handler := testHandler(newMemoryStore())
	req := httptest.NewRequest(http.MethodPost, "/api/auth/signup", bytes.NewBufferString(`{"email":"a@example.com","password":"a secure password"}`))
	req.Header.Set("Origin", "https://evil.example")
	res := httptest.NewRecorder()
	handler.ServeHTTP(res, req)
	if res.Code != http.StatusForbidden {
		t.Fatalf("status = %d", res.Code)
	}
}

func TestCORSPreflight(t *testing.T) {
	handler := testHandler(newMemoryStore())
	req := httptest.NewRequest(http.MethodOptions, "/api/auth/login", nil)
	req.Header.Set("Origin", "https://example.com")
	req.Header.Set("Access-Control-Request-Method", http.MethodPost)
	req.Header.Set("Access-Control-Request-Headers", "content-type")
	res := httptest.NewRecorder()
	handler.ServeHTTP(res, req)
	if res.Code != http.StatusNoContent {
		t.Fatalf("status = %d, body = %s", res.Code, res.Body.String())
	}
	if got := res.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("allow origin = %q", got)
	}
	if got := res.Header().Get("Access-Control-Allow-Credentials"); got != "true" {
		t.Fatalf("allow credentials = %q", got)
	}
}

func TestBackendDoesNotServeFrontendOrSourceFiles(t *testing.T) {
	handler := testHandler(newMemoryStore())
	for _, path := range []string{"/", "/index.html", "/assets/script/auth.js", "/images/thumbnail.jpg", "/go.mod", "/.env", "/internal/auth/handler.go"} {
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, httptest.NewRequest(http.MethodGet, path, nil))
		if res.Code != http.StatusNotFound {
			t.Errorf("%s status = %d", path, res.Code)
		}
	}
}

var _ = errors.Is
