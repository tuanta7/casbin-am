package middlewares

import (
	"backend/pkg/utils"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type ValidationError struct {
	FailedField string
	Tag         string
	Value       interface{}
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func validateStruct(s interface{}) []ValidationError {
	validationErrors := []ValidationError{}
	errs := validate.Struct(s)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, ValidationError{
				FailedField: err.Field(),
				Tag:         err.Tag(),
				Value:       err.Value(),
			})
		}
	}
	return validationErrors
}

func Validate(c *fiber.Ctx, s interface{}) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		if err := c.BodyParser(s); err != nil {
			return err
		}

		if errs := validateStruct(s); len(errs) > 0 {
			inputError := utils.InputError{
				FiberError: fiber.Error{
					Code:    fiber.StatusBadRequest,
					Message: fmt.Sprintf("%s is %s, received value: '%s'", errs[0].FailedField, errs[0].Tag, errs[0].Value),
				},
				Fields: []string{},
			}
			for i := range len(errs) {
				inputError.Fields = append(inputError.Fields, fmt.Sprintf("%s is %s", errs[i].FailedField, errs[i].Tag))
			}
			return inputError
		}
		c.Locals("data", s) // validated data
		return c.Next()
	}
}
