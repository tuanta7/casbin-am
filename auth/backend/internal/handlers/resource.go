package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"backend/pkg/utils"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetResourceList(c *fiber.Ctx) error {
	var resources []models.Resource
	var count int64

	if err := config.App.DB.
		Model(&models.Resource{}).
		Where("service_id = ?", c.Params("id")).Count(&count).
		Order("created_at desc").Find(&resources).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count":     count,
			"resources": resources,
		},
	})
}

func CreateResource(c *fiber.Ctx) error {
	newResource := c.Locals("data").(*validator.ResourceCreate)

	var service models.Service
	if err := config.App.DB.First(&service, c.Params("id")).Error; err != nil {
		return err
	}

	resource := models.Resource{
		Name: utils.DisplayNameToSystemName(
			newResource.DisplayName,
			utils.DisplayNameToSystemName(service.Name),
		),
		DisplayName: newResource.DisplayName,
		Description: newResource.Description,
		Service:     &service,
		ServiceID:   service.ID,
	}

	if err := config.App.DB.Create(&resource).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"resource": resource,
		},
	})
}

func UpdateResource(c *fiber.Ctx) error {
	db := config.App.DB

	var resource models.Resource
	if err := db.First(&resource, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Resource not found")
		}
		return err
	}

	updateResource := c.Locals("data").(*validator.ResourceUpdate)

	if err := db.Model(&resource).
		Update("DisplayName", updateResource.DisplayName).
		Update("Description", updateResource.Description).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"resource": resource,
		},
	})
}

func DeleteResource(c *fiber.Ctx) error {
	db := config.App.DB

	var resource models.Resource
	if err := db.First(&resource, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Resource not found")
		}
		return err
	}

	if err := db.Unscoped().Delete(&resource).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data":   fiber.Map{},
	})
}
