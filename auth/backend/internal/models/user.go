package models

type User struct {
	Base
	Email         string    `gorm:"type:varchar(100);unique;not null;index" json:"email"`
	VerifiedEmail bool      `gorm:"default:false" json:"verified_email"`
	Password      string    `gorm:"type:varchar(100);not null" json:"-"` // Password for built-in users
	Name          string    `gorm:"type:varchar(100);not null" json:"name"`
	Avatar        string    `gorm:"type:varchar(500)" json:"avatar"`
	ExternalID    string    `gorm:"index" json:"external_id,omitempty"`
	ProviderID    uint      `json:"provider_id"`
	Provider      *Provider `json:"provider"`
	Roles         []*Role   `gorm:"many2many:role_users;" json:"roles"`
	RefreshToken  string    `json:"-"`
}
