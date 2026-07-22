package auth

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	ErrEmailExists = errors.New("email already registered")
	ErrNotFound    = errors.New("record not found")
)

type User struct {
	ID           string    `json:"id" firestore:"-"`
	Email        string    `json:"email" firestore:"email"`
	PasswordHash string    `json:"-" firestore:"password_hash"`
	CreatedAt    time.Time `json:"created_at" firestore:"created_at"`
}

type Store interface {
	CreateUser(context.Context, string, string) (User, error)
	UserByEmail(context.Context, string) (User, error)
	CreateSession(context.Context, string, []byte, time.Time) error
	UserBySession(context.Context, []byte, time.Time) (User, error)
	DeleteSession(context.Context, []byte) error
}

// FirestoreStore keeps private authentication records in Firestore. The server
// SDK bypasses client security rules and authenticates with Application Default
// Credentials when running on Cloud Run.
type FirestoreStore struct{ client *firestore.Client }

type emailIndex struct {
	UserID string `firestore:"user_id"`
}

type session struct {
	UserID    string    `firestore:"user_id"`
	ExpiresAt time.Time `firestore:"expires_at"`
	CreatedAt time.Time `firestore:"created_at"`
}

func NewFirestoreStore(ctx context.Context, projectID string) (*FirestoreStore, error) {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &FirestoreStore{client: client}, nil
}

func (s *FirestoreStore) Close() error { return s.client.Close() }

func (s *FirestoreStore) CreateUser(ctx context.Context, email, passwordHash string) (User, error) {
	userRef := s.client.Collection("users").NewDoc()
	emailRef := s.client.Collection("auth_email_index").Doc(emailKey(email))
	user := User{ID: userRef.ID, Email: email, PasswordHash: passwordHash, CreatedAt: time.Now().UTC()}
	err := s.client.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		if err := tx.Create(emailRef, emailIndex{UserID: userRef.ID}); err != nil {
			return err
		}
		return tx.Create(userRef, user)
	})
	if status.Code(err) == codes.AlreadyExists {
		return User{}, ErrEmailExists
	}
	return user, err
}

func (s *FirestoreStore) UserByEmail(ctx context.Context, email string) (User, error) {
	indexDoc, err := s.client.Collection("auth_email_index").Doc(emailKey(email)).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return User{}, ErrNotFound
	}
	if err != nil {
		return User{}, err
	}
	var index emailIndex
	if err := indexDoc.DataTo(&index); err != nil {
		return User{}, err
	}
	return s.userByID(ctx, index.UserID)
}

func (s *FirestoreStore) CreateSession(ctx context.Context, userID string, tokenHash []byte, expiresAt time.Time) error {
	_, err := s.client.Collection("auth_sessions").Doc(hex.EncodeToString(tokenHash)).Create(ctx, session{
		UserID: userID, ExpiresAt: expiresAt, CreatedAt: time.Now().UTC(),
	})
	return err
}

func (s *FirestoreStore) UserBySession(ctx context.Context, tokenHash []byte, now time.Time) (User, error) {
	doc, err := s.client.Collection("auth_sessions").Doc(hex.EncodeToString(tokenHash)).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return User{}, ErrNotFound
	}
	if err != nil {
		return User{}, err
	}
	var value session
	if err := doc.DataTo(&value); err != nil {
		return User{}, err
	}
	if !value.ExpiresAt.After(now) {
		return User{}, ErrNotFound
	}
	return s.userByID(ctx, value.UserID)
}

func (s *FirestoreStore) DeleteSession(ctx context.Context, tokenHash []byte) error {
	_, err := s.client.Collection("auth_sessions").Doc(hex.EncodeToString(tokenHash)).Delete(ctx)
	return err
}

func (s *FirestoreStore) userByID(ctx context.Context, id string) (User, error) {
	doc, err := s.client.Collection("users").Doc(id).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return User{}, ErrNotFound
	}
	if err != nil {
		return User{}, err
	}
	var user User
	if err := doc.DataTo(&user); err != nil {
		return User{}, err
	}
	user.ID = doc.Ref.ID
	return user, nil
}

func emailKey(email string) string {
	hash := sha256.Sum256([]byte(email))
	return hex.EncodeToString(hash[:])
}
