package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupUserRoutes(app *fiber.App) {
	r := app.Group("/internal/users")

	r.Get("/", handlers.GetUserList)
	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.UserUpdate{}), handlers.UpdateUser)

	r.Get("/:id/roles", handlers.GetUserRoles)
	r.Post("/:id/roles", middlewares.Validate(&fiber.Ctx{}, &validator.UserRolesUpdate{}), handlers.AddUserRoles)
	r.Delete("/:id/roles", middlewares.Validate(&fiber.Ctx{}, &validator.UserRolesUpdate{}), handlers.DeleteUserRoles)
}
