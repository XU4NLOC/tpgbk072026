package auth

import (
	"context"
	"embed"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrEmailExists = errors.New("email already registered")

//go:embed migrations/*.sql
var migrations embed.FS

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

type Store interface {
	CreateUser(context.Context, string, string) (User, error)
	UserByEmail(context.Context, string) (User, error)
	CreateSession(context.Context, string, []byte, time.Time) error
	UserBySession(context.Context, []byte, time.Time) (User, error)
	DeleteSession(context.Context, []byte) error
}

type PostgresStore struct{ pool *pgxpool.Pool }

func NewPostgresStore(ctx context.Context, databaseURL string) (*PostgresStore, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}
	return &PostgresStore{pool: pool}, nil
}

func (s *PostgresStore) Close() { s.pool.Close() }

func (s *PostgresStore) Migrate(ctx context.Context) error {
	sql, err := migrations.ReadFile("migrations/001_auth.sql")
	if err != nil {
		return err
	}
	_, err = s.pool.Exec(ctx, string(sql))
	return err
}

func (s *PostgresStore) CreateUser(ctx context.Context, email, hash string) (User, error) {
	var user User
	err := s.pool.QueryRow(ctx, `INSERT INTO users (email, password_hash) VALUES ($1, $2)
		RETURNING id::text, email, password_hash, created_at`, email, hash).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil && isUniqueViolation(err) {
		return User{}, ErrEmailExists
	}
	return user, err
}

func (s *PostgresStore) UserByEmail(ctx context.Context, email string) (User, error) {
	var user User
	err := s.pool.QueryRow(ctx, `SELECT id::text, email, password_hash, created_at FROM users WHERE email = $1`, email).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	return user, err
}

func (s *PostgresStore) CreateSession(ctx context.Context, userID string, tokenHash []byte, expiresAt time.Time) error {
	_, err := s.pool.Exec(ctx, `INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`, userID, tokenHash, expiresAt)
	return err
}

func (s *PostgresStore) UserBySession(ctx context.Context, tokenHash []byte, now time.Time) (User, error) {
	var user User
	err := s.pool.QueryRow(ctx, `SELECT u.id::text, u.email, u.password_hash, u.created_at
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = $1 AND s.expires_at > $2`, tokenHash, now).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	return user, err
}

func (s *PostgresStore) DeleteSession(ctx context.Context, tokenHash []byte) error {
	_, err := s.pool.Exec(ctx, `DELETE FROM sessions WHERE token_hash = $1`, tokenHash)
	return err
}

func isUniqueViolation(err error) bool {
	var pgErr interface{ SQLState() string }
	return errors.As(err, &pgErr) && pgErr.SQLState() == "23505"
}
