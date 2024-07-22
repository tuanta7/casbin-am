package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(app *fiber.App) {
	r := app.Group("/")

	r.Post("signup", middlewares.Validate(&fiber.Ctx{}, &validator.RegisterInput{}), handlers.Register)
	r.Post("login", middlewares.Validate(&fiber.Ctx{}, &validator.LoginInput{}), handlers.Login)
	r.Get("refresh", handlers.RefreshToken)
	r.Post("logout", handlers.Logout)

	// Routes for administrators
	r.Post("internal/login", middlewares.Validate(&fiber.Ctx{}, &validator.AdminLoginInput{}), handlers.AdminLogin)
	r.Post("internal/logout", handlers.AdminLogout)
	r.Post("internal/reset", middlewares.Validate(&fiber.Ctx{}, &validator.ChangePasswordInput{}), handlers.ChangePassword)
}
