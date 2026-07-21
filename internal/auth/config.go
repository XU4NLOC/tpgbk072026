package auth

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Address       string
	DatabaseURL   string
	StaticDir     string
	CookieSecure  bool
	AllowedOrigin string
	SessionTTL    time.Duration
	BcryptCost    int
}

func LoadConfig() (Config, error) {
	cfg := Config{
		Address:       envOr("ADDRESS", ":8080"),
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		StaticDir:     envOr("STATIC_DIR", "."),
		AllowedOrigin: os.Getenv("ALLOWED_ORIGIN"),
		SessionTTL:    7 * 24 * time.Hour,
		BcryptCost:    12,
	}
	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}
	var err error
	if raw := os.Getenv("COOKIE_SECURE"); raw != "" {
		cfg.CookieSecure, err = strconv.ParseBool(raw)
		if err != nil {
			return Config{}, fmt.Errorf("COOKIE_SECURE must be true or false")
		}
	}
	return cfg, nil
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
