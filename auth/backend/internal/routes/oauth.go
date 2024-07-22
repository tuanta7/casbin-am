package routes

import (
	"backend/internal/oauth"

	"github.com/gofiber/fiber/v2"
)

func SetupOAuthRoutes(app *fiber.App) {
	r := app.Group("/oauth")

	google := r.Group("/google")
	google.Get("/authorize", oauth.GetAuthorizeUrl)
	google.Get("/callback", oauth.Callback)
	google.Get("/token", oauth.GetToken)
}
