# The Peak Garden website and authentication service

Hướng dẫn triển khai chi tiết bằng tiếng Việt dành cho đơn vị hosting: [HUONG_DAN_TRIEN_KHAI_VI.md](HUONG_DAN_TRIEN_KHAI_VI.md).

This repository contains the existing The Peak Garden static marketing website plus a Go authentication service. The service serves the website and provides email/password signup, login, current-session, and logout APIs backed by PostgreSQL.

## What was added

### Frontend

- Login buttons in the desktop and mobile headers.
- A responsive login/signup modal with email and password fields.
- Vietnamese and English authentication labels based on the site's existing `localStorage.template` language setting.
- Password visibility control and browser-native validation.
- Client authentication state restored on page load through `GET /api/auth/me`.
- Logged-in state shows the user's email and a logout button.

Frontend files changed:

- `index.html`: header controls, authentication modal, and the new script include.
- `assets/script/auth.js`: API calls and in-memory UI state.
- `assets/styles/main.css`: production authentication styles.
- `assets/styles/main.scss`: note explaining where the new legacy-compatible styles live.

The browser never reads or stores the session token. It only keeps the returned public user object in memory. The session is restored from the secure cookie whenever the page reloads.

### Backend

- Go HTTP server using the standard `net/http` router.
- PostgreSQL data store through `pgx`.
- bcrypt password hashing with cost 12.
- 256-bit cryptographically random session tokens.
- Only SHA-256 hashes of session tokens stored in PostgreSQL.
- `HttpOnly`, `SameSite=Lax` session cookie; `Secure` is configurable and must be enabled in production.
- Same-origin checks for signup, login, and logout.
- Per-process login throttling: eight failed attempts per remote IP in 15 minutes.
- Generic login failure responses and a dummy bcrypt comparison to reduce account enumeration through response content or timing.
- Request body limits, strict JSON decoding, security headers, and no caching of API responses.
- Static serving restricted to `/`, `/assets/`, and `/images/`; backend source and environment files are not publicly served.
- Graceful shutdown on `SIGINT` and `SIGTERM`.

## Requirements

- Go 1.24 or newer
- PostgreSQL 13 or newer
- HTTPS at the public reverse proxy or hosting platform

## Local setup

1. Create a PostgreSQL database and user:

   ```sql
   CREATE USER thepeakgarden WITH PASSWORD 'choose-a-local-password';
   CREATE DATABASE thepeakgarden OWNER thepeakgarden;
   ```

2. Copy the example configuration:

   ```sh
   cp .env.example .env
   ```

3. Export the variables. Go does not automatically load `.env` files:

   ```sh
   set -a
   source .env
   set +a
   ```

4. Download dependencies, test, and run:

   ```sh
   go mod download
   go test ./...
   go run ./cmd/server
   ```

5. Open `http://localhost:8080`. Keep `COOKIE_SECURE=false` only for local HTTP development.

The server automatically applies the idempotent migration in `internal/auth/migrations/001_auth.sql` when it starts.

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | — | PostgreSQL connection URI. Use TLS/SSL in production. |
| `ADDRESS` | No | `:8080` | HTTP listen address. |
| `STATIC_DIR` | No | `.` | Directory containing `index.html`, `assets`, and `images`. |
| `COOKIE_SECURE` | Production | `false` | Set to `true` when the public site uses HTTPS. |
| `ALLOWED_ORIGIN` | Recommended | Derived from request host | Exact browser origin allowed to call mutation APIs, e.g. `https://thepeakgarden.vn`. No trailing slash. |

Production example:

```sh
export DATABASE_URL='postgres://app_user:strong-password@db-host:5432/thepeakgarden?sslmode=require'
export ADDRESS=':8080'
export STATIC_DIR='.'
export COOKIE_SECURE='true'
export ALLOWED_ORIGIN='https://thepeakgarden.vn'
./thepeakgarden-server
```

Do not commit `.env`. It is ignored by Git.

## Build and deployment handoff

Build a Linux binary from the repository root:

```sh
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags='-s -w' -o thepeakgarden-server ./cmd/server
```

The host needs:

1. The compiled binary.
2. `index.html`, `assets/`, and `images/` in `STATIC_DIR`.
3. A PostgreSQL database and `DATABASE_URL`.
4. The environment variables above.
5. An HTTPS reverse proxy forwarding traffic to the Go service.

Run one service instance directly or multiple instances behind a load balancer. Sessions are stored in PostgreSQL, so they work across instances. The included rate limiter is per process; a high-traffic or multi-instance deployment should add shared rate limiting at the reverse proxy, API gateway, or Redis layer.

The reverse proxy should pass the original `Host`, but the application intentionally does not trust `X-Forwarded-For` for security throttling. Apply authoritative client-IP rate limits at the proxy if required.

## Database schema

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key, generated by PostgreSQL. |
| `email` | TEXT | Required, unique, and stored lowercase. |
| `password_hash` | TEXT | bcrypt hash; plaintext passwords are never stored. |
| `created_at` | TIMESTAMPTZ | Account creation time. |
| `updated_at` | TIMESTAMPTZ | Reserved for profile/password updates. |

### `sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key. |
| `user_id` | UUID | References `users`; sessions cascade on user deletion. |
| `token_hash` | BYTEA | Unique SHA-256 hash of the cookie token. |
| `expires_at` | TIMESTAMPTZ | Session expiry; currently seven days. |
| `created_at` | TIMESTAMPTZ | Session creation time. |

Expired sessions are rejected automatically. The hosting team should periodically remove them:

```sql
DELETE FROM sessions WHERE expires_at <= NOW();
```

## API contract

All bodies are JSON. Authentication uses the `tpg_session` cookie, not an Authorization header.

### `POST /api/auth/signup`

Request:

```json
{"email":"person@example.com","password":"a password with 12+ characters"}
```

Creates the user, starts a session, and returns HTTP `201`:

```json
{"user":{"id":"uuid","email":"person@example.com","created_at":"2026-07-21T00:00:00Z"}}
```

Returns `400` for invalid input and `409` when the email is already registered.

### `POST /api/auth/login`

Uses the same request body. On success, starts a session and returns HTTP `200` with the public user object. Incorrect credentials always return the generic HTTP `401` response:

```json
{"error":"invalid email or password"}
```

### `GET /api/auth/me`

Returns HTTP `200` and the public user object for a valid session, otherwise `401`.

### `POST /api/auth/logout`

Deletes the current server-side session, expires the cookie, and returns HTTP `204`.

Error responses consistently use:

```json
{"error":"human-readable message"}
```

## Authentication and security decisions

- Emails are trimmed and normalized to lowercase before lookup/storage.
- Passwords must contain 12–72 characters. The 72-character limit matches bcrypt's safe input limit.
- Password complexity rules are intentionally avoided; long passphrases and password managers are encouraged.
- Cookies are inaccessible to JavaScript (`HttpOnly`) and unavailable cross-site for normal requests (`SameSite=Lax`).
- Production must set `COOKIE_SECURE=true` so cookies are sent only over HTTPS.
- Session cookies expire after seven days. Logout invalidates the corresponding database record.
- State-changing endpoints validate the `Origin` header when browsers provide it.
- Database queries are parameterized.
- Login responses do not distinguish unknown email from incorrect password.

For a wider account system, recommended future features are verified email ownership, password reset, session/device management, audit logging, and optional multi-factor authentication. They are deliberately outside this feature's current scope.

## Tests

Run:

```sh
go test ./...
go test -race ./...
```

The automated handler tests use an isolated in-memory store and cover:

- Signup, email normalization, and non-plaintext password storage.
- Secure cookie properties and hashed session storage.
- Session restoration and logout invalidation.
- Successful and unsuccessful login.
- Identical unknown-user and wrong-password errors.
- Password-length validation.
- Cross-site mutation rejection.
- Prevention of accidental source-file exposure.

The PostgreSQL migration should additionally be exercised against the client's staging database before production deployment.

## Project layout

```text
cmd/server/main.go                       application entry point
internal/auth/config.go                 environment configuration
internal/auth/handler.go                HTTP API, sessions, validation, throttling
internal/auth/store.go                  PostgreSQL persistence
internal/auth/migrations/001_auth.sql   users and sessions schema
internal/auth/handler_test.go           authentication API tests
assets/script/auth.js                   browser authentication state and UI
index.html                              website and authentication modal
```
