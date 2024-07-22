package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetRouteList(c *fiber.Ctx) error {
	var routes []models.Route
	var count int64

	if err := config.App.DB.
		Model(&models.Route{}).
		Where("resource_id", c.Params("id")).Count(&count).
		Order("path").Order("method asc").Find(&routes).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count":  count,
			"routes": routes,
		},
	})
}

func CreateRoute(c *fiber.Ctx) error {
	newRoute := c.Locals("data").(*validator.RouteCreate)

	resourceID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid resource ID")
	}

	route := models.Route{
		Path:        newRoute.Path,
		Description: newRoute.Description,
		Method:      newRoute.Method,
		ResourceID:  uint(resourceID),
	}

	if err := config.App.DB.Create(&route).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"route": route,
		},
	})
}

func UpdateRoute(c *fiber.Ctx) error {
	newRoute := c.Locals("data").(*validator.RouteUpdate)

	db := config.App.DB

	var route models.Route
	if err := db.First(&route, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Route not found")
		}
		return err
	}

	if err := db.Model(&route).Updates(newRoute).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"route": route,
		},
	})
}

func DeleteRoute(c *fiber.Ctx) error {
	db := config.App.DB

	var route models.Route
	if err := db.First(&route, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Resource not found")
		}
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := DeletePolicyByPath(route.Path, route.Method); err != nil {
			return err
		}

		if err := db.Unscoped().Delete(&route).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   fiber.Map{},
	})
}

func UpdateRequiredPermissions(c *fiber.Ctx) error {
	var route models.Route
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"route": route,
		},
	})
}
