package validator

type UserRolesUpdate struct {
	RoleIDs []uint `json:"role_ids" validate:"required,dive"`
}

type RoleCreate struct {
	DisplayName string `json:"display_name" validate:"required,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type RoleUpdate struct {
	DisplayName string `json:"display_name" validate:"omitempty,max=100"`
	Description string `json:"description" validate:"omitempty,max=100"`
}

type RolePoliciesUpdate struct {
	PolicyIDs []uint `json:"policy_ids" validate:"required,dive"`
}
