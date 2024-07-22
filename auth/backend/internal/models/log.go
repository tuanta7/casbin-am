package models

import "time"

type Log struct {
	ID         uint      `gorm:"primarykey,autoIncrement" json:"id"`
	Email      string    `json:"email"`
	URL        string    `json:"url"`
	Method     string    `json:"method"`
	Allowed    bool      `json:"allowed"`
	DenyReason string    `json:"deny_reason"`
	CreatedAt  time.Time `json:"created_at"`
}
