package validator

import "time"

type ProviderCreate struct {
	Name         string `json:"name" validate:"required,max=100"`
	URL          string `json:"url" validate:"url,required"`
	ClientId     string `json:"client_id,omitempty"`
	ClientSecret string `json:"client_secret,omitempty"`
}

type ProviderUpdate struct {
	Name         string    `json:"name,omitempty" validate:"max=100"`
	URL          string    `json:"url,omitempty" validate:"omitempty"`
	ClientId     string    `json:"client_id,omitempty"`
	ClientSecret string    `json:"client_secret,omitempty"`
	UpdatedAt    time.Time `json:"-"`
}
