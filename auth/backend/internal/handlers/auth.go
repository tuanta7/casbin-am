package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"backend/pkg/utils"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Register(c *fiber.Ctx) error {
	db := config.App.DB
	input := c.Locals("data").(*validator.RegisterInput)

	err := db.First(&models.User{}, "email = ?", input.Email).Error
	if err != gorm.ErrRecordNotFound {
		return fiber.NewError(fiber.StatusConflict, "Email already exists")
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		return &fiber.Error{
			Code:    fiber.StatusInternalServerError,
			Message: err.Error(),
		}
	}

	user := models.User{
		Name:          input.Name,
		Email:         input.Email,
		VerifiedEmail: false,
		Password:      hashedPassword,
		ProviderID:    1,
	}

	if err := db.Create(&user).Error; err != nil {
		return err
	}

	tokens, err := utils.GenerateTokens(&user)
	if err != nil {
		return err
	}

	user.RefreshToken = tokens.RefreshToken
	if err := db.Save(&user).Error; err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    tokens.RefreshToken,
		Expires:  time.Now().Add(time.Hour * 24 * 7),
		HTTPOnly: true,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"access_token": tokens.AccessToken,
			"user":         user,
		},
	})
}

func Login(c *fiber.Ctx) error {
	db := config.App.DB
	input := c.Locals("data").(*validator.LoginInput)

	var user models.User
	if err := db.
		Where("email = ?", input.Email).
		Where("provider_id = 1").
		First(&user).
		Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid email or password, please try again 🫰")
		}
		return err
	}

	if !utils.ComparePassword(user.Password, input.Password) {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid email or password, please try again 🫰")
	}

	tokens, err := utils.GenerateTokens(&user)
	if err != nil {
		return err
	}

	user.RefreshToken = tokens.RefreshToken
	if err := db.Save(&user).Error; err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    tokens.RefreshToken,
		Expires:  time.Now().Add(time.Hour * 24 * 7),
		HTTPOnly: true,
		Secure:   config.App.JWTCookieSecure,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"access_token": tokens.AccessToken,
			"user":         user,
		},
	})
}

func ChangePassword(c *fiber.Ctx) error {
	db := config.App.DB
	input := c.Locals("data").(*validator.ChangePasswordInput)

	claims := c.Locals("user").(*models.User)
	var user models.User
	if err := db.
		Where("email = ?", claims.Email).
		First(&user).
		Error; err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "User not found")
	}

	if !utils.ComparePassword(user.Password, input.OldPassword) {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid old password")
	}

	hashedPassword, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		return err
	}

	user.Password = hashedPassword
	if err := db.Save(&user).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}

func Logout(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have logged out, please login again 🕺")
	}

	claims, err := utils.ReadJWT(refreshToken)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid refresh token")
	}

	var user models.User
	if err := config.App.DB.
		Where("id = ?", claims.Subject).
		First(&user).
		Error; err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "User not found")
	}

	if user.RefreshToken != refreshToken {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid refresh token")
	}

	user.RefreshToken = ""
	if err := config.App.DB.Save(&user).Error; err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:    "refresh_token",
		Value:   "",
		Expires: time.Now().Add(time.Minute),
	})
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}

func RefreshToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return fiber.NewError(fiber.StatusBadRequest, "You have logged out, please login again 🕺")
	}

	claims, err := utils.ReadJWT(refreshToken)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid refresh token")
	}

	var user models.User
	if err := config.App.DB.
		Where("id = ?", claims.Subject).
		First(&user).
		Error; err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "User not found")
	}

	if user.RefreshToken != refreshToken {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid refresh token")
	}

	tokens, err := utils.GenerateTokens(&user)
	if err != nil {
		return err
	}

	user.RefreshToken = tokens.RefreshToken
	if err := config.App.DB.Save(&user).Error; err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    tokens.RefreshToken,
		Expires:  claims.ExpiresAt.Add(0),
		HTTPOnly: true,
		Secure:   config.App.JWTCookieSecure,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"access_token": tokens.AccessToken,
		},
	})
}

func CasbinAuthorizeRequest(c *fiber.Ctx) error {
	log := models.Log{}
	defer config.App.DB.Create(&log)

	payload := struct {
		AccessToken   string `json:"access_token"`
		RequestURL    string `json:"request_url"`
		RequestMethod string `json:"request_method"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		log.DenyReason = err.Error()
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"decision": false,
			"error":    err.Error(),
		})
	}

	if payload.AccessToken == "" || payload.RequestURL == "" || payload.RequestMethod == "" {
		log.DenyReason = "Missing required fields"
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"decision": false,
			"error":    "Missing required fields",
		})
	}

	log.URL = payload.RequestURL
	log.Method = payload.RequestMethod

	claims, err := utils.ReadJWT(payload.AccessToken)
	if err != nil {
		log.DenyReason = err.Error()
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"decision": false,
			"error":    err.Error(),
		})
	}
	log.Email = claims.Subject

	var user models.User
	if err := config.App.DB.
		Where("email = ?", claims.Subject).
		First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"decision": false,
			"err":      "User not found",
		})
	}

	ok, err := AuthorizeRequest(user.Email, payload.RequestURL, payload.RequestMethod)
	log.Allowed = ok
	if err != nil {
		log.DenyReason = err.Error()
	}
	if !ok {
		log.DenyReason = "Casbin: This user doesn't have required permission"
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"decision": ok,
		"error":    log.DenyReason,
		"user":     user,
	})
}

func AdminLogin(c *fiber.Ctx) error {
	db := config.App.DB
	input := c.Locals("data").(*validator.AdminLoginInput)

	var user *models.User
	if err := db.
		Where("email = ?", input.Username).
		Where("provider_id = 1").
		First(&user).
		Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid username or password, please try again")
		}
		return err
	}

	if !utils.ComparePassword(user.Password, input.Password) {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid username or password, please try again")
	}

	store := config.App.SessionStore
	s, err := store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Can not get or create session store")
	}
	defer s.Save()

	s.Set("email", user.Email)
	s.Set("name", user.Name)
	s.Set("avatar", user.Avatar)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"user": user,
		},
	})
}

func AdminLogout(c *fiber.Ctx) error {
	store := config.App.SessionStore
	s, _ := store.Get(c)
	store.Delete(s.ID())
	defer s.Save()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}
