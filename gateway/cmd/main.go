package main

import (
	"gateway/internal/auth"
	"gateway/internal/configuration"
	v1 "gateway/web/api/v1"

	"github.com/Nerzal/gocloak/v7"
)

func main() {
	client := gocloak.NewClient(configuration.GetConfiguration("KEYCLOAK_URL"))
	auth := auth.NewAuth(client)

	apiV1 := v1.NewApiV1()
	apiV1.NewAuthAPI(auth)
	apiV1.Start()
}
