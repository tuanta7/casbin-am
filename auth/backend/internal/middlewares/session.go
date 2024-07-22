package middlewares

import (
	"backend/config"
	"backend/internal/models"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func VerifySession(c *fiber.Ctx) error {
	store := config.App.SessionStore
	enforcer := config.App.Enforcer

	s, err := store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Can not get session store")
	}
	defer s.Save()

	email := s.Get("email")
	if email == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid session")
	}

	c.Locals("user", &models.User{
		Email:  email.(string),
		Name:   s.Get("name").(string),
		Avatar: s.Get("avatar").(string),
	})

	ok, err := enforcer.Enforce(email, c.BaseURL(), strings.ToUpper(c.Method()))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if !ok {
		return fiber.NewError(fiber.StatusForbidden, "You are not authorized to access this resource")
	}
	fmt.Println("Authorized by Casbin")
	return c.Next()
}
