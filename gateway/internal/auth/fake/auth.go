package fake

import (
	"gateway/internal/auth"

	"github.com/Nerzal/gocloak/v7"
)

type AuthFake struct{}

func NewAuthFake() auth.UseCases {
	return AuthFake{}
}

func (fake AuthFake) Login(username, password string) (*gocloak.JWT, error) {
	return &gocloak.JWT{}, nil
}

func (fake AuthFake) Logout(refreshToken string) error {
	return nil
}

func (fake AuthFake) ResetPassword() error {
	return nil
}

func (fake AuthFake) Register() (interface{}, error) {
	return nil, nil
}
