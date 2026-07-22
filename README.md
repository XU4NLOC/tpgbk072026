# The Peak Garden

This repository contains the existing static marketing-site files and a Go
authentication API. They are deployed separately:

- The existing host serves `https://thepeakgarden.vn`
- Cloud Run serves only the Go `/api/**` routes behind the website host's
  `https://thepeakgarden.vn/api/**` reverse proxy
- Cloud Firestore for users, email indexes, and sessions

See [FIREBASE_DEPLOY.md](FIREBASE_DEPLOY.md) for setup and deployment.

## Local development

Requirements: Go 1.25+, a Firebase project with Firestore enabled, and Google
Application Default Credentials.

```sh
cp .env.example .env
gcloud auth application-default login
export FIREBASE_PROJECT_ID="your-project-id"
export COOKIE_SECURE=false
export ALLOWED_ORIGIN="http://localhost:3000"
go run ./cmd/server
```

The API listens at `http://localhost:8080`; run the frontend separately at the
origin configured in `ALLOWED_ORIGIN`.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Signup and login accept JSON containing `email` and `password`. Passwords must
be 12–72 characters. Authentication uses a secure, HTTP-only `__session`
cookie; only its
SHA-256 hash is stored in Firestore.

## Firestore collections

- `users`: normalized email, bcrypt password hash, creation time
- `auth_email_index`: SHA-256 email key mapped to a user ID
- `auth_sessions`: SHA-256 session-token key, user ID, and expiry time

The email index and user are created in one transaction. Client access is
denied by `firestore.rules`; the trusted Cloud Run service uses its IAM identity.

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `FIREBASE_PROJECT_ID` | Yes | Cloud project env fallback | Firebase/Google Cloud project ID |
| `ADDRESS` | No | `:8080` | Listen address |
| `COOKIE_SECURE` | Production | `false` | Must be `true` on HTTPS |
| `ALLOWED_ORIGIN` | Recommended | Request origin | Exact public origin, without trailing slash |

Run tests with `go test ./...`.
