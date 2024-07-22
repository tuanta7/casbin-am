package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetPermissionList(c *fiber.Ctx) error {
	permissions, err := GetAllPermissionsForSubject(c.Query("q", " "))
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"permissions": permissions,
		},
	})
}

func GetRoleInlinePermissions(c *fiber.Ctx) error {
	db := config.App.DB

	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role *models.Role
	if err := db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	permissions, err := GetPermissionsForRole(role.Name)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"permissions": permissions,
		},
	})
}

func CreateRoleInlinePermission(c *fiber.Ctx) error {
	db := config.App.DB
	data := c.Locals("data").(*validator.PermissionCreate)

	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role *models.Role
	if err := db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	var service *models.Service
	if err := db.First(&service, data.ServiceID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Service not found")
		}
		return err
	}

	var route *models.Route
	if err := db.First(&route, data.RouteID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Route not found")
		}
		return err
	}

	effect := "deny"
	if *data.IsAllow {
		effect = "allow"
	}
	ok, err := AddPermissionForRole(role.Name, route, effect, service)
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Permission already exists")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"affected": ok,
		},
	})
}

func DeleteRoleInlinePermission(c *fiber.Ctx) error {
	var role *models.Role
	var permission []string

	if err := c.BodyParser(&permission); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	if len(permission) != 5 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid permission data")
	}

	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	if err := config.App.DB.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	ok, err := DeletePermissionForRole(role.Name, permission[1:])
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusNotFound, "Permission not found")
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data":   nil,
	})
}

func GetPolicyPermissions(c *fiber.Ctx) error {
	db := config.App.DB

	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var policy *models.Policy
	if err := db.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	permissions, err := GetPermissionsForRole(policy.Name)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"permissions": permissions,
		},
	})
}

func CreatePolicyPermission(c *fiber.Ctx) error {
	db := config.App.DB
	data := c.Locals("data").(*validator.PermissionCreate)

	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid policy ID")
	}

	var policy *models.Policy
	if err := db.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	var service *models.Service
	if err := db.First(&service, data.ServiceID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Service not found")
		}
		return err
	}

	var route *models.Route
	if err := db.First(&route, data.RouteID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Route not found")
		}
		return err
	}

	effect := "deny"
	if *data.IsAllow {
		effect = "allow"
	}

	ok, err := AddPermissionForRole(policy.Name, route, effect, service)
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Permission already exists")
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"affected": ok,
		},
	})
}

func DeletePolicyPermission(c *fiber.Ctx) error {
	policyID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid policy ID")
	}

	var permission []string
	if err := c.BodyParser(&permission); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	if len(permission) != 6 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid permission data")
	}

	var policy *models.Policy
	if err := config.App.DB.First(&policy, policyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Policy not found")
		}
		return err
	}

	ok, err := DeletePermissionForRole(policy.Name, permission[1:])
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusNotFound, "Permission not found")
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"status": "success",
		"data":   nil,
	})
}
