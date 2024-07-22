package validator

type ResourceCreate struct {
	DisplayName string `json:"display_name" validate:"required,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type ResourceUpdate struct {
	DisplayName string `json:"display_name" validate:"omitempty,max=200"`
	Description string `json:"description" validate:"omitempty,max=100"`
}
