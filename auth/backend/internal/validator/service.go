package validator

import "time"

type ServiceCreate struct {
	Domain      string `json:"domain" validate:"required"`
	Name        string `json:"name" validate:"required,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type ServiceUpdate struct {
	Domain      string    `json:"domain,omitempty" validate:"url"`
	Name        string    `json:"name,omitempty" validate:"max=100"`
	Description string    `json:"description" validate:"max=100"`
	UpdatedAt   time.Time `json:"-"`
}
