package middlewares

import (
	"backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func HandleCors(c *fiber.Ctx) error {
	c.Append("Access-Control-Allow-Origin", utils.GetEnv("AllowOrigin", "http://localhost:5173")) // Vite
	if c.Method() == fiber.MethodOptions {
		c.Append("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Append("Access-Control-Allow-Headers", "Accept, Content-Type, X-CSRF-Token, Authorization")
		c.Append("Access-Control-Allow-Credentials", "true")
		return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
	}
	return c.Next()
}
