package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupRoleRoutes(app *fiber.App) {
	r := app.Group("/internal/roles")

	r.Get("/", handlers.GetRoleList)
	r.Post("/", middlewares.Validate(&fiber.Ctx{}, &validator.RoleCreate{}), handlers.CreateNewRole)
	r.Get("/:id", handlers.GetRoleByID)
	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.RoleUpdate{}), handlers.UpdateRole)
	r.Delete("/:id", handlers.DeleteRole)

	r.Get("/:id/permissions", handlers.GetRoleInlinePermissions)
	r.Post("/:id/permissions", middlewares.Validate(&fiber.Ctx{}, &validator.PermissionCreate{}), handlers.CreateRoleInlinePermission)
	r.Delete("/:id/permissions", handlers.DeleteRoleInlinePermission)

	r.Get("/:id/users", handlers.GetRoleUsers)
	r.Get("/:id/policies", handlers.GetRolesPolicies)
	r.Post("/:id/policies", middlewares.Validate(&fiber.Ctx{}, &validator.RolePoliciesUpdate{}), handlers.AddRolePolicies)
	r.Delete("/:id/policies", handlers.DeleteRolePolicy)
}
