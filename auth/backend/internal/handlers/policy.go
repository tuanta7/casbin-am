package handlers

import (
	"backend/config"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/validator"
	"backend/pkg/utils"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetPolicyList(c *fiber.Ctx) error {
	var policies []models.Policy
	var count int64

	filter := c.Locals("filter").(*middlewares.FilterParams)

	if err := config.App.DB.
		Model(&models.Policy{}).Count(&count).
		Offset((filter.Page-1)*filter.Limit).
		Limit(filter.Limit).
		Where("name LIKE ?", fmt.Sprintf("%%%s%%", filter.Search)).
		Find(&policies).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count":    count,
			"policies": policies,
		},
	})
}

func GetPolicy(c *fiber.Ctx) error {
	db := config.App.DB
	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid policy ID")
	}

	var policy models.Policy
	if err := db.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"policy": policy,
		},
	})
}

func CreateNewPolicy(c *fiber.Ctx) error {
	db := config.App.DB
	newPolicy := c.Locals("data").(*validator.PolicyCreate)

	policy := models.Policy{
		Name:        utils.DisplayNameToSystemName(newPolicy.DisplayName),
		DisplayName: newPolicy.DisplayName,
		Description: newPolicy.Description,
	}

	if err := db.Create(&policy).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"policy": policy,
		},
	})
}

func UpdatePolicy(c *fiber.Ctx) error {
	db := config.App.DB
	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid policy ID")
	}

	updatePolicy := c.Locals("data").(*validator.PolicyUpdate)

	var policy models.Policy
	if err := db.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	if err := db.Model(&policy).Updates(updatePolicy).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"policy": policy,
		},
	})
}

func DeletePolicy(c *fiber.Ctx) error {
	db := config.App.DB
	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid policy ID")
	}

	var policy models.Policy
	if err := db.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := db.Unscoped().Delete(&models.Policy{}, policyID).Error; err != nil {
			return err
		}
		_, err := DeleteRoleOrPolicy(policy.Name)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data":   nil,
	})
}
