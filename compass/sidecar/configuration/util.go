package configuration

import "os"

func GetEnv(key string) string {
	defaultEnvs := map[string]string{
		"PLUGINS_REPO": "https://github.com/gabrielleitezup/plugins-compass.git",
		"DIST_DIR":     "./dist",
		"PLUGINS_DIR":  "./plugins",
		"SCRIPTS_DIR":  "sidecar/scripts",
		"GIT_TOKEN":    "sometoken",
	}

	if env := os.Getenv(key); env != "" {
		return env
	}

	return defaultEnvs[key]
}
