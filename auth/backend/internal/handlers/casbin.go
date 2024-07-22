package handlers

import (
	"backend/config"
	"backend/internal/models"
	"errors"
	"fmt"
	"strings"
)

func AuthorizeRequest(email string, url string, method string) (bool, error) {
	ok, err := config.App.Enforcer.Enforce(email, url, method)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func DeleteRoleOrPolicy(role string) (bool, error) {
	ok, err := config.App.Enforcer.DeleteRole(role)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func GetUsersForRole(role *models.Role) ([]string, error) {
	e := config.App.Enforcer
	users, err := e.GetUsersForRole(role.Name)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func GetPermissionsForRole(role string) ([][]string, error) {
	e := config.App.Enforcer
	permissions, err := e.GetPermissionsForUser(role)
	if err != nil {
		return nil, err
	}
	return permissions, nil
}

func GetAllPermissionsForSubject(sub string) ([][]string, error) {
	e := config.App.Enforcer
	permissions, err := e.GetImplicitPermissionsForUser(sub)
	if err != nil {
		return nil, err
	}
	return permissions, nil
}

func AddRolesForUser(user *models.User, roles []*models.Role) (bool, error) {
	affected := false
	for _, role := range roles {
		ok, err := config.App.Enforcer.AddRoleForUser(user.Email, role.Name)
		if err != nil {
			return false, err
		}
		if ok {
			affected = true
		}
	}
	return affected, nil
}

func DeleteRolesForUser(user string, roles []*models.Role) (bool, error) {
	for _, role := range roles {
		_, err := config.App.Enforcer.DeleteRoleForUser(user, role.Name)
		if err != nil {
			return false, err
		}
	}
	return true, nil
}

func AddPermissionForRole(role string, route *models.Route, effect string, service *models.Service) (bool, error) {
	e := config.App.Enforcer
	ok, err := e.AddPermissionsForUser(
		role,
		[]string{
			fmt.Sprintf("%s%s", service.Domain, route.Path),
			route.Method,
			effect,
			service.Name,
			service.Domain,
		},
	)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func DeletePermissionForRole(role string, permission []string) (bool, error) {
	e := config.App.Enforcer

	if role == "admin" && permission[3] == "All Services" {
		return false, errors.New("cannot delete default permission for admin")
	}

	ok, err := e.DeletePermissionForUser(role, permission...)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func GetImclicitRoles(sub string) ([]string, error) {
	roles, err := config.App.Enforcer.GetImplicitRolesForUser(sub)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

func AddPoliciesForRoles(role *models.Role, policies []*models.Policy) (bool, error) {
	affected := false
	for _, policy := range policies {
		ok, err := config.App.Enforcer.AddRoleForUser(role.Name, policy.Name)
		if err != nil {
			return false, err
		}
		if ok {
			affected = true
		}
	}
	return affected, nil
}

func DeletePolicyForRole(role string, policy string) (bool, error) {
	e := config.App.Enforcer
	ok, err := e.DeleteRoleForUser(role, policy)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func UpdateServiceDomain(curr, new string, name ...string) error {
	e := config.App.Enforcer
	permissions := e.GetFilteredPolicy(5, curr)
	for _, permission := range permissions {
		newPermission := append([]string{}, permission...)
		newPermission[1] = fmt.Sprintf("%s%s", new, strings.Split(newPermission[1], curr)[1])
		newPermission[5] = new
		_, err := e.UpdatePolicy(permission, newPermission)
		if err != nil {
			return err
		}
	}
	return nil
}

func DeletePolicyByDomain(s string) error {
	e := config.App.Enforcer
	permissions := e.GetFilteredPolicy(5, s)
	for _, permission := range permissions {
		_, err := e.RemovePolicy(permission)
		if err != nil {
			return err
		}
	}
	return nil
}

func DeletePolicyByPath(path, method string) error {
	e := config.App.Enforcer
	permissions := e.GetFilteredPolicy(2, path, method)
	for _, permission := range permissions {
		_, err := e.RemovePolicy(permission)
		if err != nil {
			return err
		}
	}
	return nil
}
