package routes

import (
	"backend/internal/handlers"
	"backend/internal/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupLogRoutes(app *fiber.App) {
	r := app.Group("/internal/logs")

	r.Get("/", middlewares.GetQueryParams, handlers.GetLogList)
}
