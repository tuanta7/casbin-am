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

func GetUserList(c *fiber.Ctx) error {
	var users []models.User
	var count int64

	if err := config.App.DB.
		Model(&users).Count(&count).
		Joins("Provider").
		Order("created_at desc").
		Find(&users).
		Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"count": count,
			"users": users,
		},
	})
}

func UpdateUser(c *fiber.Ctx) error {
	db := config.App.DB

	var user models.User
	if err := db.First(&user, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	updateUser := c.Locals("data").(*validator.UserUpdate)
	updateUser.UpdatedAt = time.Now()
	if err := db.Model(&user).Updates(updateUser).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"user": user,
		},
	})
}

func GetUserRoles(c *fiber.Ctx) error {
	var user models.User
	if err := config.App.DB.
		Preload("Roles").
		First(&user, c.Params("id")).
		Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"user": user,
		},
	})
}

func AddUserRoles(c *fiber.Ctx) error {
	db := config.App.DB

	var user *models.User
	if err := db.Preload("Roles").First(&user, c.Params("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	updateRoles := c.Locals("data").(*validator.UserRolesUpdate)
	var roles []*models.Role
	if err := db.Where("id IN ?", updateRoles.RoleIDs).Find(&roles).Error; err != nil {
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		user.Roles = append(user.Roles, roles...)
		if err := tx.Save(&user).Error; err != nil {
			return err
		}

		ok, err := AddRolesForUser(user, roles)
		if err != nil {
			return err
		}
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to add roles")
		}
		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"user": user,
		},
	})
}

func DeleteUserRoles(c *fiber.Ctx) error {
	db := config.App.DB

	userID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user id")
	}

	var user *models.User
	if err := db.Preload("Roles").First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	rolesToDelete := c.Locals("data").(*validator.UserRolesUpdate)
	var roles []*models.Role
	if err := db.Where("id IN ?", rolesToDelete.RoleIDs).Find(&roles).Error; err != nil {
		return err
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := db.Model(&user).Association("Roles").Delete(roles); err != nil {
			return err
		}

		ok, err := DeleteRolesForUser(user.Email, roles)
		if err != nil {
			return err
		}
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete roles")
		}

		return nil
	}); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"user": user,
		},
	})
}
