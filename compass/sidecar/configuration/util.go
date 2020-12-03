package configuration

import "os"

var initialValues = map[string]string{
	"PLUGINS_REPO": "https://github.com/gabrielleitezup/grpc-plugin-server.git",
	"GIT_DIR":      "./tmp/git",
	"GIT_TOKEN":    "dd3948445f9c21d369f9a962542b140792b21807",
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
