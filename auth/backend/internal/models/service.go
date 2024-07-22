package models

type Service struct {
	Base
	Domain      string `gorm:"unique;not null" json:"domain"`
	Name        string `gorm:"type:varchar(100);unique;not null" json:"name"`
	Description string `gorm:"type:varchar(100)" json:"description"`
}
