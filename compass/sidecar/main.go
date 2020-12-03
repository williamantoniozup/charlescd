package main

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/cloner"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

var watcher *fsnotify.Watcher

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

func watchDir(path string, fi os.FileInfo, err error) error {
	if fi.Mode().IsDir() {
		return watcher.Add(path)
	}

	return nil
}

func buildPlugins(plugins map[string][]string) error {
	buildScriptName := "build.sh"

	for category, plugins := range plugins {
		for _, plugin := range plugins {
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

func removePlugins(plugins map[string][]string) error {
	name := "/bin/sh"
	removeScriptName := "remove.sh"

	for category, plugins := range plugins {
		for _, plugin := range plugins {
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

func managePlugins() error {
	pluginMap := make(map[string][]string)
	folders, err := ioutil.ReadDir(getEnv("PLUGINS_DIR"))
	if err != nil {
		log.Fatal(err)
	}

	for _, category := range folders {
		if category.IsDir() {

			plugins, err := ioutil.ReadDir(getEnv("PLUGINS_DIR") + "/" + category.Name())
			if err != nil {
				log.Fatal(err)
			}

			for _, plugin := range plugins {
				pluginMap[category.Name()] = append(pluginMap[category.Name()], plugin.Name())
			}
		}
	}

	err = buildPlugins(pluginMap)
	if err != nil {
		return err
	}

	return nil
}

type Server struct{}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`:)`))
}

func main() {
	cloner.SyncGitOps()

	err := managePlugins()
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
