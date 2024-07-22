package models

type Provider struct {
	Base
	Name         string `gorm:"type:varchar(100);unique;not null" json:"name"`
	URL          string `gorm:"unique;not null" json:"url"`
	ClientId     string `gorm:"type:varchar(100)" json:"client_id"`
	ClientSecret string `gorm:"type:varchar(100)" json:"client_secret"`
}