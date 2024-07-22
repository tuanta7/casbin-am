package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetServiceList(c *fiber.Ctx) error {
	var services []models.Service
	var count int64

	if err := config.App.DB.
		Model(&models.Service{}).Count(&count).
		Order("created_at desc").Find(&services).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count":    count,
			"services": services,
		},
	})
}

func AddNewService(c *fiber.Ctx) error {
	newService := c.Locals("data").(*validator.ServiceCreate)

	service := models.Service{
		Domain:      newService.Domain,
		Name:        newService.Name,
		Description: newService.Description,
	}

	if err := config.App.DB.Create(&service).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"service": service,
		},
	})
}

func GetServiceByID(c *fiber.Ctx) error {
	var service models.Service

	if err := config.App.DB.First(&service, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Service not found")
		}
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"service": service,
		},
	})
}

func UpdateService(c *fiber.Ctx) error {
	db := config.App.DB

	var service models.Service
	if err := db.First(&service, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Service not found")
		}
		return err
	}

	updateService := c.Locals("data").(*validator.ServiceUpdate)
	updateService.UpdatedAt = time.Now()

	if err := db.Transaction(func(tx *gorm.DB) error {
		if updateService.Domain != "" && updateService.Domain != service.Domain {
			err := UpdateServiceDomain(service.Domain, updateService.Domain, updateService.Name)
			if err != nil {
				return err
			}
		}
		if err := db.Model(&service).
			Updates(updateService). // Only update non-zero fields
			Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"service": service,
		},
	})
}

func DeleteService(c *fiber.Ctx) error {
	var service models.Service
	db := config.App.DB

	if err := db.First(&service, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Service not found")
		}
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := DeletePolicyByDomain(service.Domain); err != nil {
			return err
		}

		if err := db.Unscoped().Delete(&service).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data":   fiber.Map{},
	})
}
