package configuration

import "os"

var initialValues = map[string]string{
	"KEYCLOAK_URL": "https://charles-dev.continuousplatform.com/keycloak",
	"REALM":        "charlescd",
	"CLIENT_ID":    "charlescd-client",
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
