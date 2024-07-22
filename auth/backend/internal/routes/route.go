package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupRouteRoutes(app *fiber.App) {
	r := app.Group("/internal/routes")

	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.RouteUpdate{}), handlers.UpdateRoute)
	r.Delete("/:id", handlers.DeleteRoute)
}
