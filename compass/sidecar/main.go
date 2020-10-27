package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os/exec"
	"time"

	"github.com/imdario/mergo"
)

const (
	tmpDir = "tmp"
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

	for category, plugins := range plugins {
		for plugin := range plugins {
			out, err := exec.Command("/bin/sh", "./sidecar/build.sh", category, plugin).Output()
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

	for category, plugins := range plugins {
		for plugin := range plugins {
			out, err := exec.Command("/bin/sh", "./sidecar/remove.sh", category, plugin).Output()
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

	return ioutil.WriteFile("./sidecar/lockfile.json", fileContent, 0644)
}

func main() {
	// TODO: Criar /health para health check k8s
	// TODO: Escutar mudancas na pasta de plugins no PVC
	// TODO: Buildar plugins e mover para a pasta dist
	// TODO: Fazer o diff da pasta plugins do PVC com a dist local

	ticker := time.NewTicker(5 * time.Second)
	for {
		select {
		case <-ticker.C:
			pvcLockfile, err := readLockfile("plugins/lockfile.json")
			if err != nil {
				panic(err)
			}

			localLockfile, err := readLockfile("sidecar/lockfile.json")
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
