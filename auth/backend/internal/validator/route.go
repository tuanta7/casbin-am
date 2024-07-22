package validator

type RouteCreate struct {
	Path        string `json:"path" validate:"required,max=100"`
	Method      string `json:"method" validate:"required"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type RouteUpdate struct {
	Path        string `json:"path" validate:"omitempty,max=100"`
	Method      uint   `json:"method" validate:"omitempty"`
	Description string `json:"description" validate:"omitempty,max=100"`
}
