package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

func SetupProviderRoutes(app *fiber.App) {
	r := app.Group("/internal/providers")

	r.Get("/", handlers.GetProviderList)
	r.Post("/", middlewares.Validate(&fiber.Ctx{}, &validator.ProviderCreate{}), handlers.AddNewProvider)
	r.Patch("/:id", middlewares.Validate(&fiber.Ctx{}, &validator.ProviderUpdate{}), handlers.UpdateProvider)
}
