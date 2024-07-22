package models

type Route struct {
	Base
	Path        string    `gorm:"type:varchar(100);index:route_path" json:"path"`
	Description string    `gorm:"type:varchar(100)" json:"description"`
	ResourceID  uint      `json:"resource_id"`
	Resource    *Resource `json:"resource,omitempty"`
	Method      string    `gorm:"type:method_enum; not null" json:"method"`
	// CREATE TYPE method_enum AS ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE', '*');
}
