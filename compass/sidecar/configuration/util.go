package configuration

import "os"

var initialValues = map[string]string{
	"PLUGINS_REPO": "https://github.com/gabrielleitezup/grpc-plugin-server.git",
	"GIT_DIR":      "./tmp/git",
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
