package main

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/builder"
	"github.com/ZupIT/charlescd/compass/sidecar/cloner"
	"github.com/ZupIT/charlescd/compass/sidecar/configuration"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
)

var watcher *fsnotify.Watcher

func watchDir(path string, fi os.FileInfo, err error) error {
	if fi.Mode().IsDir() {
		return watcher.Add(path)
	}

	return nil
}

func getInterval() (time.Duration, error) {
	return time.ParseDuration("15s")
}

type Server struct{}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`:)`))
}

func main() {
	resync := make(chan bool)

	err := builder.RemovePlugins()
	if err != nil {
		log.Fatalln(err)
	}

	err = builder.ManagePlugins()
	if err != nil {
		log.Fatalln(err)
	}

	watcher, _ = fsnotify.NewWatcher()
	defer watcher.Close()

	if err := filepath.Walk(fmt.Sprintf("%s", configuration.GetEnv("PLUGINS_DIR")), watchDir); err != nil {
		log.Fatalln(err)
	}

	project := cloner.Project{
		Repository: fmt.Sprintf("%s", configuration.GetEnv("PLUGINS_REPO")),
	}

	interval, err := getInterval()
	if err != nil {
		log.Fatalln(err)
	}

	r, err := cloner.CloneAndOpenRepository(project)
	if err != nil {
		log.Fatalln(err)
	}

	err = cloner.InitializeRevision(r)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Start lockfile verifier...")
	go func() {
		ticker := time.NewTicker(interval)
		for {
			select {
			case event := <-watcher.Events:
				log.Println("PVC changes detected: ", event)
				err := builder.ManagePlugins()
				if err != nil {
					log.Fatalln(err)
				}
			case <-ticker.C:
				err := cloner.Sync(r)
				if err != nil {
					log.Fatalln(err)
				}
				fmt.Println("Automated Sync...")
			case <-resync:
				err := cloner.Sync(r)
				if err != nil {
					log.Fatalln(err)
				}
				fmt.Println("Request Sync")
			}
		}
	}()

	s := &Server{}
	http.Handle("/health", s)
	http.HandleFunc("/sync", func(w http.ResponseWriter, r *http.Request) {
		resync <- true
	})
	log.Println("Start server on 9000...")
	log.Fatal(http.ListenAndServe(":9000", nil))
}
