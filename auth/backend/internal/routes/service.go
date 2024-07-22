package routes

import (
	"backend/internal/handlers"
	middlewares "backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupServiceRoutes(app *fiber.App) {
	r := app.Group("/internal/services")

	r.Get("/", handlers.GetServiceList)
	r.Post("/", middlewares.Validate(&fiber.Ctx{}, &validator.ServiceCreate{}), handlers.AddNewService)
	r.Get("/:id", handlers.GetServiceByID)
	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.ServiceUpdate{}), handlers.UpdateService)
	r.Delete("/:id", handlers.DeleteService)

	r = r.Group("/:id/resources")
	r.Get("/", handlers.GetResourceList)
	r.Post("/", middlewares.Validate(&fiber.Ctx{}, &validator.ResourceCreate{}), handlers.CreateResource)
}
