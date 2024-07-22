package config

import (
	"backend/internal/models"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/casbin/casbin/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

var App Config

type Config struct {
	DB                  *gorm.DB
	Enforcer            *casbin.Enforcer
	GoogleConfig        *oauth2.Config
	SessionStore        *session.Store
	JWTSecret           string
	JWTExpiry           time.Duration
	JWTRefreshExpiry    time.Duration
	JWTBuiltinIssuerURL string
	JWTCookieSecure     bool
}

func LoadGoogleConfig(db *gorm.DB) *oauth2.Config {
	googleProvider := &models.Provider{}
	if err := db.
		Where("url = ?", os.Getenv("GOOGLE_ISSUER_URL")).
		First(&googleProvider).Error; err != nil {
		return nil
	}

	if googleProvider.ClientId == "" || googleProvider.ClientSecret == "" {
		return nil
	}

	return &oauth2.Config{
		RedirectURL:  fmt.Sprintf("%s/oauth/google/callback", os.Getenv("BASE_URL")),
		ClientID:     googleProvider.ClientId,
		ClientSecret: googleProvider.ClientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
			"openid",
		},
		Endpoint: google.Endpoint,
	}
}

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
