package handlers

import (
	"backend/config"
	"backend/internal/middlewares"
	"backend/internal/models"

	"github.com/gofiber/fiber/v2"
)

func GetLogList(c *fiber.Ctx) error {
	var logs []models.Log
	var count int64

	filter := c.Locals("filter").(*middlewares.FilterParams)

	if err := config.App.DB.
		Model(&models.Log{}).Count(&count).
		Order("created_at desc").
		Offset((filter.Page - 1) * filter.Limit).
		Limit(filter.Limit).
		Find(&logs).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count": count,
			"logs":  logs,
		},
	})
}
