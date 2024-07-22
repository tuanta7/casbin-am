package middlewares

import (
	"github.com/gofiber/fiber/v2"
)

type FilterParams struct {
	Page   int    `json:"page"`
	Limit  int    `json:"limit"`
	Search string `json:"search"`
}

func GetQueryParams(c *fiber.Ctx) error {
	c.Locals("filter", &FilterParams{
		Page:   c.QueryInt("page", 1),
		Limit:  c.QueryInt("limit", 10),
		Search: c.Query("search", ""),
	})
	return c.Next()
}
