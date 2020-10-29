package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
	"github.com/imdario/mergo"
)

const (
	lockfileName = "lockfile.json"
)

var watcher *fsnotify.Watcher

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

func createLockfile(lockFolderPath string) error {
	lockFilePath := fmt.Sprintf("%s/%s", lockFolderPath, lockfileName)

	if _, err := os.Stat(lockFolderPath); os.IsNotExist(err) {
		err = os.Mkdir(lockFolderPath, 0755)
		if err != nil {
			return err
		}

		return ioutil.WriteFile(lockFilePath, []byte("{}"), 0644)
	} else if _, err := os.Stat(lockFilePath); os.IsNotExist(err) {
		return ioutil.WriteFile(lockFilePath, []byte("{}"), 0644)
	}
	return nil
}

func watchDir(path string, fi os.FileInfo, err error) error {
	if fi.Mode().IsDir() {
		return watcher.Add(path)
	}

	return nil
}

func managePlugins() error {
	pvcLockfile, err := readLockfile(fmt.Sprintf("%s/%s", getEnv("PLUGINS_DIR"), lockfileName))
	if err != nil {
		return err
	}

	localLockfile, err := readLockfile(fmt.Sprintf("%s/%s", getEnv("DIST_DIR"), lockfileName))
	if err != nil {
		return err
	}

	addPlugins, pluginsForRemotion, isDiff := diffLockfiles(pvcLockfile, localLockfile)
	if err != nil {
		return err
	}

	if isDiff {
		err = buildPlugins(addPlugins)
		if err != nil {
			return err
		}

		err = removePlugins(pluginsForRemotion)
		if err != nil {
			return err
		}

		err = writeLockfile(localLockfile, pvcLockfile, pluginsForRemotion)
		if err != nil {
			return err
		}
	}

	return nil
}

type Server struct{}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`:)`))
}

func main() {

	err := createLockfile(getEnv("DIST_DIR"))
	if err != nil {
		log.Fatalln(err)
	}

	err = createLockfile(getEnv("PLUGINS_DIR"))
	if err != nil {
		log.Fatalln(err)
	}

	err = managePlugins()
	if err != nil {
		log.Fatalln(err)
	}

	watcher, _ = fsnotify.NewWatcher()
	defer watcher.Close()

	if err := filepath.Walk(fmt.Sprintf("%s", getEnv("PLUGINS_DIR")), watchDir); err != nil {
		log.Fatalln(err)
	}

	log.Println("Start lockfile verifier...")
	go func() {
		for {
			select {
			case event := <-watcher.Events:
				log.Println("PVC changes detected: ", event)
				err := managePlugins()
				if err != nil {
					log.Fatalln(err)
				}
			}
		}
	}()

	s := &Server{}
	http.Handle("/health", s)
	log.Println("Start server on 9000...")
	log.Fatal(http.ListenAndServe(":9000", nil))
}
