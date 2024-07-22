package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetProviderList(c *fiber.Ctx) error {
	var providers []models.Provider
	var count int64

	if err := config.App.DB.
		Model(&models.Provider{}).Count(&count).
		Order("created_at desc").
		Find(&providers).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count":     count,
			"providers": providers,
		},
	})
}

func AddNewProvider(c *fiber.Ctx) error {
	db := config.App.DB
	newProvider := c.Locals("data").(*validator.ProviderCreate)

	provider := models.Provider{
		Name:         newProvider.Name,
		URL:          newProvider.URL,
		ClientId:     newProvider.ClientId,
		ClientSecret: newProvider.ClientSecret,
	}

	if err := db.Create(&provider).Error; err != nil {
		return err
	}

	if provider.URL == os.Getenv("GOOGLE_ISSUER_URL") {
		fmt.Println("Updating Google Config....")
		config.App.GoogleConfig = config.LoadGoogleConfig(db)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"provider": provider,
		},
	})
}

func UpdateProvider(c *fiber.Ctx) error {
	db := config.App.DB

	providerID, err := c.ParamsInt("id")
	if err != nil {
		return err
	}

	var provider models.Provider
	if err := db.First(&provider, providerID).Error; err != nil {
		return err
	}

	updateProvider := c.Locals("data").(*validator.ProviderUpdate)
	updateProvider.UpdatedAt = time.Now()
	if err := db.Model(&provider).Updates(&updateProvider).Error; err != nil {
		return err
	}

	if provider.URL == os.Getenv("GOOGLE_ISSUER_URL") {
		fmt.Println("Updating Google Config....")
		config.App.GoogleConfig = config.LoadGoogleConfig(db)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"provider": provider,
		},
	})
}
