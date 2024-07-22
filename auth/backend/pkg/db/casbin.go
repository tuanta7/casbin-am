package db

import (
	"log"

	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/gorm"
)

func LoadCasbinEnforcer(db *gorm.DB) (*casbin.Enforcer, error) {
	a, err := gormadapter.NewAdapterByDBUseTableName(db, "casbin", "rules") // casbin_rules
	if err != nil {
		log.Printf("Adapter error: %s", err)
		return nil, err
	}

	m, err := model.NewModelFromFile("./model.conf") // go run ./cmd/api
	if err != nil {
		log.Printf("Model file error: %s", err)
		return nil, err
	}

	e, err := casbin.NewEnforcer(m, a)
	if err != nil {
		log.Printf("Enforcer error: %s", err)
		return nil, err
	}

	// Subject, Object, Action, Effect, Service, Domain
	e.AddPolicy([]string{"root", "*", "*", "allow", "All Services", "*"})
	return e, nil
}
