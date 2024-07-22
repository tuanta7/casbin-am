package db

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToPostgres() (*gorm.DB, error) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		DriverName: "pgx",
		DSN:        os.Getenv("DSN"),
	}), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	// adminPassword, _ := bcrypt.GenerateFromPassword([]byte(os.Getenv("ROOT_PASSWORD")), bcrypt.DefaultCost)
	// db.FirstOrCreate(&models.User{
	// 	Name:       "Admin",
	// 	Email:      "root",
	// 	Password:   string(adminPassword),
	// 	ProviderID: 1,
	// })

	return db, nil
}
