package models

type Role struct {
	Base
	Name        string  `gorm:"type:varchar(100);unique;not null;index" json:"name"`
	DisplayName string  `gorm:"type:varchar(100);unique;not null" json:"display_name"`
	Description string  `gorm:"type:varchar(100)" json:"description"`
	Users       []*User `gorm:"many2many:role_users;" json:"users,omitempty"`
}
