package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupResourceRoutes(app *fiber.App) {
	r := app.Group("/internal/resources")

	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.ResourceUpdate{}), handlers.UpdateResource)
	r.Delete("/:id", handlers.DeleteResource)

	r.Get("/:id/routes", handlers.GetRouteList)
	r.Post("/:id/routes", middlewares.Validate(&fiber.Ctx{}, &validator.RouteCreate{}), handlers.CreateRoute)
}
