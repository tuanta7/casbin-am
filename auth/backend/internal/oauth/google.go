package oauth

import (
	"backend/config"
	"backend/internal/models"
	"backend/pkg/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"

	"gorm.io/gorm"
)

func GetAuthorizeUrl(c *fiber.Ctx) error {
	googleConfig := config.App.GoogleConfig
	if googleConfig == nil {
		return fiber.NewError(fiber.StatusNotFound, "Login with Google is not available")
	}

	store := config.App.SessionStore
	s, err := store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Can not get or create session store")
	}
	defer s.Save()

	state := utils.RandomString(32)
	s.Set("state", state)
	s.Set("redirect_url", c.Query("redirect_url"))

	// return c.Redirect(googleConfig.AuthCodeURL(state)) // CORS issue
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"authorize_url": googleConfig.AuthCodeURL(state),
	})
}

func Callback(c *fiber.Ctx) error {
	googleConfig := config.App.GoogleConfig
	if googleConfig == nil {
		return fiber.NewError(fiber.StatusNotFound, "Login with Google is not available")
	}

	s, err := config.App.SessionStore.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Can not get session store")
	}
	defer s.Save()

	if c.Query("state") != s.Get("state") {
		return fiber.NewError(fiber.StatusForbidden, "State mismatch")
	}

	googleTokens, err := googleConfig.Exchange(context.Background(), c.Query("code"))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Tokens exchange failed")
	}

	user, err := getOrCreateUser(googleTokens.AccessToken)
	if err != nil {
		return err
	}

	tokens, err := utils.GenerateTokens(user)
	if err != nil {
		return err
	}

	s.Set("access_token", tokens.AccessToken)
	s.Set("refresh_token", tokens.RefreshToken)
	return c.Redirect(s.Get("redirect_url").(string))
}

func GetToken(c *fiber.Ctx) error {
	store := config.App.SessionStore
	s, err := store.Get(c)
	if err != nil {
		return c.SendString("Session store error")
	}
	defer s.Save()

	access_token := s.Get("access_token")
	store.Delete(s.ID())
	if access_token == nil {
		return fiber.NewError(fiber.StatusNotFound, "No token found in session")
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    s.Get("refresh_token").(string),
		Expires:  time.Now().Add(config.App.JWTRefreshExpiry),
		HTTPOnly: true,
		Secure:   true,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"access_token": access_token.(string),
		},
	})
}

func getOrCreateUser(accessToken string) (*models.User, error) {
	request := fiber.Get(fmt.Sprintf("%s?alt=json&access_token=%s", os.Getenv("GOOGLE_TOKEN_ENDPOINT"), accessToken))
	request.Debug()

	_, data, errs := request.Bytes()
	if errs != nil {
		return nil, errs[0]
	}

	var userinfo UserInfo
	err := json.Unmarshal(data, &userinfo)
	if err != nil {
		return nil, err
	}

	var provider models.Provider
	if err := config.App.DB.
		Where("url = ?", os.Getenv("GOOGLE_ISSUER_URL")).
		First(&provider).Error; err != nil {
		return nil, err
	}

	user := models.User{
		Name:          userinfo.Name,
		Email:         userinfo.Email,
		VerifiedEmail: userinfo.VerifiedEmail,
		Avatar:        userinfo.Avatar,
		ExternalID:    userinfo.ID,
		ProviderID:    provider.ID,
	}

	if err := config.App.DB.Where(&models.User{
		Email:      user.Email,
		ExternalID: user.ExternalID,
		ProviderID: user.ProviderID,
	}).First(&models.User{}).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if e := config.App.DB.Create(&user).Error; e != nil {
				return nil, e
			}
		} else {
			return nil, err
		}
	}

	return &user, nil
}

type UserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Avatar        string `json:"picture"`
}
