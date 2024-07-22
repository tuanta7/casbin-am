package validator

type PolicyCreate struct {
	DisplayName string `json:"display_name" validate:"required,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type PolicyUpdate struct {
	DisplayName string `json:"display_name" validate:"omitempty,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}
