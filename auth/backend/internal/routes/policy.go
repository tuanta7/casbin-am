package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupPolicyRoutes(app *fiber.App) {
	r := app.Group("/internal/policies")

	r.Get("/", middlewares.GetQueryParams, handlers.GetPolicyList)
	r.Get("/:id", handlers.GetPolicy)
	r.Post("/", middlewares.Validate(&fiber.Ctx{}, &validator.PolicyCreate{}), handlers.CreateNewPolicy)
	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.PolicyUpdate{}), handlers.UpdatePolicy)
	r.Delete("/:id", handlers.DeletePolicy)

	r.Get("/:id/permissions", handlers.GetPolicyPermissions)
	r.Post("/:id/permissions", middlewares.Validate(&fiber.Ctx{}, &validator.PermissionCreate{}), handlers.CreatePolicyPermission)
	r.Delete("/:id/permissions", handlers.DeletePolicyPermission)
}
