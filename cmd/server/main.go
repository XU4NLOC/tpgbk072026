package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"thepeakgarden/internal/auth"
)

func main() {
	cfg, err := auth.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	store, err := auth.NewFirestoreStore(ctx, cfg.ProjectID)
	if err != nil {
		log.Fatalf("connect to database: %v", err)
	}
	defer func() { _ = store.Close() }()

	handler := auth.NewHandler(store, cfg)
	server := &http.Server{
		Addr:              cfg.Address,
		Handler:           handler.Routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("The Peak Garden server listening on %s", cfg.Address)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("serve: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown: %v", err)
	}
}
