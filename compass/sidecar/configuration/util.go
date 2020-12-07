package configuration

import "os"

func GetEnv(key string) string {
	defaultEnvs := map[string]string{
		"PLUGINS_REPO": "https://github.com/gabrielleitezup/plugins-compass.git",
		"DIST_DIR":     "./dist",
		"PLUGINS_DIR":  "./plugins",
		"SCRIPTS_DIR":  "sidecar/scripts",
		"GIT_TOKEN":    "10e79f3b100259c4f359a85388676cd8b7c5eee1",
	}

	if env := os.Getenv(key); env != "" {
		return env
	}

	return defaultEnvs[key]
}
