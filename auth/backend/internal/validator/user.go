package validator

import "time"

type UserUpdate struct {
	Name      string    `json:"name,omitempty" validate:"max=100"`
	Avatar    string    `json:"avatar,omitempty" validate:"omitempty,url"`
	UpdatedAt time.Time `json:"-"`
}
