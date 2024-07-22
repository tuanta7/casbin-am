package validator

type RegisterInput struct {
	Name            string `json:"name" validate:"required,min=3,max=100"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=8,max=32"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=32"`
}

type ChangePasswordInput struct {
	OldPassword     string `json:"old_password" validate:"required,min=8,max=32"`
	NewPassword     string `json:"new_password" validate:"required,min=8,max=32"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=NewPassword"`
}

type AdminLoginInput struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=8,max=32"`
}
