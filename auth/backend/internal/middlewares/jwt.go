package middlewares

import (
	"backend/config"
	"backend/internal/models"
	"backend/pkg/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func VerifyAccessToken(c *fiber.Ctx) error {
	authorizationHeader := c.Get("Authorization")
	if authorizationHeader == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Authorization header is required")
	}

	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid Authorization header")
	}

	accessToken := headerParts[1]
	fmt.Println(accessToken)
	if accessToken == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "No token found")
	}

	claims, err := utils.ReadJWT(accessToken)
	if err != nil {
		return err
	}

	var user *models.User
	if err := config.App.DB.Where("email = ?", claims.Subject).First(&user).Error; err != nil {
		return err
	}
	if claims.Issuer != config.App.JWTBuiltinIssuerURL {
		return fiber.NewError(fiber.StatusForbidden, "Invalid Issuer")
	}

	c.Locals("user", user)
	return c.Next()
}
