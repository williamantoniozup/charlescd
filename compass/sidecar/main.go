package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/imdario/mergo"
)

const (
	lockfileName = "lockfile.json"
)

func readLockfile(path string) (map[string]map[string]float32, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var lockfile map[string]map[string]float32
	err = json.Unmarshal(file, &lockfile)
	if err != nil {
		return nil, err
	}

	return lockfile, nil
}

func Difference(x, y map[string]map[string]float32) (bool, map[string]map[string]float32) {
	diffPlugins := map[string]map[string]float32{}
	isDiff := false

	for category, plugins := range x {
		if _, ok := y[category]; !ok {
			isDiff = true
			diffPlugins[category] = plugins
			continue
		}

		for name := range plugins {
			if _, ok := y[category][name]; !ok {
				isDiff = true
				diffPlugins[category] = make(map[string]float32)
				currentLocalPlugin := diffPlugins[category][name]
				diffPlugins[category][name] = currentLocalPlugin
			}
		}
	}

	return isDiff, diffPlugins
}

func diffLockfiles(pvcLockfile, localLockfile map[string]map[string]float32) (map[string]map[string]float32, map[string]map[string]float32, bool) {
	isDiffAdd, addPlugins := Difference(pvcLockfile, localLockfile)
	isDiffRemove, removePlugins := Difference(localLockfile, pvcLockfile)

	return addPlugins, removePlugins, (isDiffAdd || isDiffRemove)
}

func buildPlugins(plugins map[string]map[string]float32) error {
	buildScriptName := "build.sh"

	for category, plugins := range plugins {
		for plugin := range plugins {
			out, err := exec.Command("/bin/sh", fmt.Sprintf("%s/%s", getEnv("SCRIPTS_DIR"), buildScriptName), category, plugin).Output()
			if err != nil {
				fmt.Println(err)
				return err
			}

			fmt.Println(string(out))
		}
	}

	return nil
}

func removePlugins(plugins map[string]map[string]float32) error {
	name := "/bin/sh"
	removeScriptName := "remove.sh"

	for category, plugins := range plugins {
		for plugin := range plugins {
			out, err := exec.Command(name, fmt.Sprintf("%s/%s", getEnv("SCRIPTS_DIR"), removeScriptName), category, plugin).Output()
			if err != nil {
				fmt.Println(err)
				return err
			}

			fmt.Println(string(out))
		}
	}

	return nil
}

func writeLockfile(localLockfile, pvcLockfile, removePlugins map[string]map[string]float32) error {
	totalLocalPlugins := localLockfile

	if err := mergo.Merge(&totalLocalPlugins, pvcLockfile, mergo.WithOverride); err != nil {
		return err
	}

	for category, plugins := range removePlugins {
		for plugin := range plugins {
			delete(totalLocalPlugins[category], plugin)
		}
	}

	fileContent, err := json.MarshalIndent(totalLocalPlugins, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile(fmt.Sprintf("%s/%s", getEnv("DIST_DIR"), lockfileName), fileContent, 0644)
}

func getEnv(key string) string {
	defaultEnvs := map[string]string{
		"DIST_DIR":    "./dist",
		"PLUGINS_DIR": "./plugins",
		"SCRIPTS_DIR": "sidecar/scripts",
	}

	if env := os.Getenv(key); env != "" {
		return env
	}

	return defaultEnvs[key]
}

func createDistLockfile() error {
	lockfilePath := fmt.Sprintf("%s/%s", getEnv("DIST_DIR"), lockfileName)
	if _, err := os.Stat(lockfilePath); err != nil {
		if os.IsNotExist(err) {
			err = os.Mkdir(getEnv("DIST_DIR"), 0755)
			if err != nil {
				return err
			}

			return ioutil.WriteFile(lockfilePath, []byte("{}"), 0644)
		}
	}
	return nil
}

func main() {
	err := createDistLockfile()
	if err != nil {
		log.Fatalln(err)
	}

	ticker := time.NewTicker(5 * time.Second)
	for {
		select {
		case <-ticker.C:
			pvcLockfile, err := readLockfile(fmt.Sprintf("%s/%s", getEnv("PLUGINS_DIR"), lockfileName))
			if err != nil {
				panic(err)
			}

			localLockfile, err := readLockfile(fmt.Sprintf("%s/%s", getEnv("DIST_DIR"), lockfileName))
			if err != nil {
				panic(err)
			}

			addPlugins, pluginsForRemotion, isDiff := diffLockfiles(pvcLockfile, localLockfile)
			if err != nil {
				panic(err)
			}

			if isDiff {
				err = buildPlugins(addPlugins)
				if err != nil {
					log.Fatalln(err)
				}

				err = removePlugins(pluginsForRemotion)
				if err != nil {
					log.Fatalln(err)
				}

				err = writeLockfile(localLockfile, pvcLockfile, pluginsForRemotion)
				if err != nil {
					log.Fatalln(err)
				}
			}
		}
	}

}
