package models

type Resource struct {
	Base
	Name        string   `gorm:"type:varchar(200);unique;not null" json:"name"`
	DisplayName string   `gorm:"type:varchar(200);unique;not null" json:"display_name"`
	Description string   `gorm:"type:varchar(100)" json:"description"`
	ServiceID   uint     `json:"-"`
	Service     *Service `json:"service,omitempty"`
	Routes      []*Route `json:"routes,omitempty"`
}
