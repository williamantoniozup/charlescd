package util

import (
	"compass/internal/env"
)

func IsDeveloperRunning() bool {
	return env.GetConfiguration("ENV") == "DEV"
}
