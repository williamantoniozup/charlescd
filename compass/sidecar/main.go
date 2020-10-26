package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os/exec"
	"time"
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

func diffLockfiles(pvcLockfile, localLockfile map[string]map[string]float32) (bool, map[string]map[string]float32) {
	diffPlugins := map[string]map[string]float32{}
	isDiff := false

	for pvcCategory, pvcPlugins := range pvcLockfile {
		if _, ok := localLockfile[pvcCategory]; !ok {
			isDiff = true
			diffPlugins[pvcCategory] = pvcPlugins
			continue
		}

		for pvcPluginName := range pvcPlugins {
			if _, ok := localLockfile[pvcCategory][pvcPluginName]; !ok {
				isDiff = true
				currentLocalPlugin := diffPlugins[pvcCategory][pvcPluginName]
				diffPlugins[pvcCategory][pvcPluginName] = currentLocalPlugin
			}
		}
	}

	return isDiff, diffPlugins
}

func buildPlugins(plugins map[string]map[string]float32) error {
	for category, plugins := range plugins {
		for plugin := range plugins {
			sourceDir := fmt.Sprintf("./tmp/%s/%s/*.go", category, plugin)
			outDir := fmt.Sprintf("./dist/%s/%s/%s.so", category, plugin, plugin)
			cmd := exec.Command("go", "build", "-buildmode=plugin", "-o", outDir, sourceDir)

			fmt.Println(sourceDir)
			fmt.Println(outDir)

			_, err := cmd.CombinedOutput()
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func main() {
	// TODO: Criar /health para health check k8s
	// TODO: Escutar mudancas na pasta de plugins no PVC
	// TODO: Buildar plugins e mover para a pasta dist
	// TODO: Fazer o diff da pasta plugins do PVC com a dist local

	ticker := time.NewTicker(5000)
	for {
		select {
		case <-ticker.C:
			pvcLockfile, err := readLockfile("tmp/lockfile.json")
			if err != nil {
				panic(err)
			}

			localLockfile, err := readLockfile("sidecar/lockfile.json")
			if err != nil {
				panic(err)
			}

			isDiff, diffPlugins := diffLockfiles(pvcLockfile, localLockfile)
			if err != nil {
				panic(err)
			}

			if isDiff {
				err = buildPlugins(diffPlugins)
				if err != nil {
					log.Fatalln(err)
				}
			}
		}
	}

}
