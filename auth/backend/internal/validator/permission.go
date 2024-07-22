package validator

type PermissionCreate struct {
	ServiceID uint  `json:"service_id" validate:"required"`
	RouteID   uint  `json:"route_id" validate:"required"`
	IsAllow   *bool `json:"is_allow" validate:"required"`
}
