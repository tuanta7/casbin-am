package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/validator"
	"backend/pkg/utils"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetRoleList(c *fiber.Ctx) error {
	var roles []models.Role
	var count int64

	if err := config.App.DB.
		Model(&models.Role{}).Count(&count).
		Order("created_at desc").Find(&roles).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count": count,
			"roles": roles,
		},
	})
}

func CreateNewRole(c *fiber.Ctx) error {
	newRole := c.Locals("data").(*validator.RoleCreate)

	role := models.Role{
		Name:        utils.DisplayNameToSystemName(newRole.DisplayName),
		DisplayName: newRole.DisplayName,
		Description: newRole.Description,
	}

	if err := config.App.DB.Create(&role).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"role": role,
		},
	})
}

func GetRoleByID(c *fiber.Ctx) error {
	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := config.App.DB.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"role": role,
		},
	})
}

func UpdateRole(c *fiber.Ctx) error {
	db := config.App.DB
	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	updateRole := c.Locals("data").(*validator.RoleUpdate)
	if err := db.Model(&role).
		Update("DisplayName", updateRole.DisplayName).
		Update("Description", updateRole.Description).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"role": role,
		},
	})
}

func DeleteRole(c *fiber.Ctx) error {
	db := config.App.DB
	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		_, err := DeleteRoleOrPolicy(role.Name)
		if err != nil {
			return err
		}
		if err := db.Unscoped().Delete(&role).Error; err != nil {
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

func GetRoleUsers(c *fiber.Ctx) error {
	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role *models.Role
	if err := config.App.DB.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	users, err := GetUsersForRole(role)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"role":  role,
			"users": users,
		},
	})
}

func GetRolesPolicies(c *fiber.Ctx) error {
	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var role *models.Role
	if err := config.App.DB.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	roles, err := GetImclicitRoles(role.Name)
	fmt.Println(roles)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"role":     role,
			"policies": roles,
		},
	})
}

func AddRolePolicies(c *fiber.Ctx) error {
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

	data := c.Locals("data").(*validator.RolePoliciesUpdate)
	var policies []*models.Policy
	if err := db.Where("id IN ?", data.PolicyIDs).Find(&policies).Error; err != nil {
		return err
	}

	ok, err := AddPoliciesForRoles(role, policies)
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusInternalServerError, "Policy already exists for this role")
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"policies": policies,
		},
	})
}

func DeleteRolePolicy(c *fiber.Ctx) error {
	db := config.App.DB

	roleID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid role ID")
	}

	var policy string
	if err := c.BodyParser(&policy); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	var role *models.Role
	if err := db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Role not found")
		}
		return err
	}

	ok, err := DeletePolicyForRole(role.Name, policy)
	if err != nil {
		return err
	}
	if !ok {
		return fiber.NewError(fiber.StatusNotFound, "Policy not found")
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   fiber.Map{},
	})
}
