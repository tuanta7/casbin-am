package main

import (
	"log"
	"os"
	"time"

	"backend/config"
	"backend/internal/handlers"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/routes"
	"backend/pkg/db"
	"backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/session"
)

func main() {
	conn, err := db.ConnectToPostgres()
	if err != nil {
		log.Fatal("Can not connect to Postgres")
	}
	log.Println("Connected to Postgres")

	enforcer, err := db.LoadCasbinEnforcer(conn)
	if err != nil {
		log.Fatal("Can not get Casbin Enforcer")
	}
	log.Println("Casbin Enforcer loaded")

	googleConfig := config.LoadGoogleConfig(conn)
	if googleConfig == nil {
		log.Default().Println("No Google provider found")
	}

	config.App = config.Config{
		DB:           conn,
		Enforcer:     enforcer,
		GoogleConfig: googleConfig,
		SessionStore: session.New(session.Config{
			Expiration:     60 * time.Minute,
			CookieHTTPOnly: true,
		}),
		JWTSecret:           utils.GetEnv("JWT_SECRET", utils.RandomString(32)),
		JWTExpiry:           1 * time.Hour,
		JWTRefreshExpiry:    7 * 24 * time.Hour,
		JWTBuiltinIssuerURL: os.Getenv("BASE_URL"),
		JWTCookieSecure:     false,
	}

	app := fiber.New(fiber.Config{
		AppName:       "Heimdall",
		ErrorHandler:  utils.ErrorHandler,
		CaseSensitive: true,
	})

	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("ALLOW_ORIGINS"), // To establish a SSO session
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, X-CSRF-Token, Authorization",
	}))

	// Public routes
	app.Get("/userinfo", middlewares.VerifyAccessToken, func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "success",
			"data": fiber.Map{
				"user": c.Locals("user").(*models.User),
			},
		})
	})
	routes.SetupOAuthRoutes(app)
	routes.SetupAuthRoutes(app)

	// Internal routes
	app.Post("/internal/verify", handlers.CasbinAuthorizeRequest)
	app.Get("/internal/userinfo", middlewares.VerifySession, func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "success",
			"data": fiber.Map{
				"user": c.Locals("user").(*models.User),
			},
		})
	})
	app.Use(middlewares.VerifySession)
	routes.SetupLogRoutes(app)
	routes.SetupPolicyRoutes(app)
	routes.SetupProviderRoutes(app)
	routes.SetupUserRoutes(app)
	routes.SetupServiceRoutes(app)
	routes.SetupResourceRoutes(app)
	routes.SetupRouteRoutes(app)
	routes.SetupRoleRoutes(app)
	app.Get("/internal/permissions", handlers.GetPermissionList)
	app.Use("*", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "Not Found",
		})
	})

	// Start the server on port 8000
	err = app.Listen(":8000")
	if err != nil {
		log.Fatal(err)
	}
}
