package auth

import (
	"context"
	"gateway/internal/configuration"

	"github.com/Nerzal/gocloak/v7"
)

type UseCases interface {
	Login(username, password string) (*gocloak.JWT, error)
	Logout(refreshToken string) error
	ResetPassword() error
	Register() (interface{}, error)
}

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Auth struct {
	keycloakClient gocloak.GoCloak
}

func NewAuth(keycloakClient gocloak.GoCloak) UseCases {
	return Auth{keycloakClient}
}

func (auth Auth) Login(username, password string) (*gocloak.JWT, error) {
	ctx := context.Background()
	return auth.keycloakClient.Login(
		ctx,
		configuration.GetConfiguration("CLIENT_ID"),
		configuration.GetConfiguration("CLIENT_ID"),
		configuration.GetConfiguration("REALM"),
		username,
		password,
	)
}

func (auth Auth) Logout(refreshToken string) error {
	ctx := context.Background()
	return auth.keycloakClient.Logout(
		ctx,
		configuration.GetConfiguration("CLIENT_ID"),
		configuration.GetConfiguration("CLIENT_ID"),
		configuration.GetConfiguration("REALM"),
		refreshToken,
	)
}

func (auth Auth) ResetPassword() error {
	return nil
}

func (auth Auth) Register() (interface{}, error) {
	return nil, nil
}
