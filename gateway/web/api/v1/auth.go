package v1

import (
	"encoding/json"
	"gateway/internal/auth"
	"gateway/web/api"

	routing "github.com/qiangxue/fasthttp-routing"
	"github.com/valyala/fasthttp"
)

type AuthAPI struct {
	auth auth.UseCases
}

func (v1 ApiV1) NewAuthAPI(auth auth.UseCases) AuthAPI {
	authAPI := AuthAPI{auth}
	v1.router.Post("/login", authAPI.login)
	v1.router.Post("/logout", authAPI.logout)
	return authAPI

}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (authApi AuthAPI) login(c *routing.Context) error {
	loginRequest := LoginRequest{}
	err := json.Unmarshal(c.Request.Body(), &loginRequest)
	if err != nil {
		return api.NewRestError(c, fasthttp.StatusInternalServerError, err)
	}

	jwt, err := authApi.auth.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		return api.NewRestError(c, fasthttp.StatusInternalServerError, err)
	}

	return api.NewRestSuccess(c, fasthttp.StatusOK, jwt)
}

type LogoutRequest struct {
	RefreshToken string `json:"refreshToken"`
}

func (authApi AuthAPI) logout(c *routing.Context) error {
	logoutRequest := LogoutRequest{}
	err := json.Unmarshal(c.Request.Body(), &logoutRequest)
	if err != nil {
		return api.NewRestError(c, fasthttp.StatusInternalServerError, err)
	}

	err = authApi.auth.Logout(logoutRequest.RefreshToken)
	if err != nil {
		return api.NewRestError(c, fasthttp.StatusInternalServerError, err)
	}

	return api.NewRestSuccess(c, fasthttp.StatusNoContent, nil)
}
