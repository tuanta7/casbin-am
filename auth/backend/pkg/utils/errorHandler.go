package utils

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(c *fiber.Ctx, err error) error {
	var data []string
	code := fiber.StatusInternalServerError
	status := "error"

	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}

	if ie, ok := err.(InputError); ok {
		data = ie.Fields
	}

	if code >= 400 && code < 500 {
		status = "fail"
	}

	return c.Status(code).JSON(fiber.Map{
		"status":  status,
		"message": err.Error(),
		"data":    data,
	})
}

type InputError struct {
	FiberError fiber.Error `json:"error"`
	Fields     []string    `json:"invalid_fields"`
}

func (i InputError) Error() string {
	return i.FiberError.Message
}

func (i InputError) Unwrap() error {
	return &i.FiberError
}
