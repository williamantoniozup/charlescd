package main

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/builder"
	"github.com/ZupIT/charlescd/compass/sidecar/configuration"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

var watcher *fsnotify.Watcher

func watchDir(path string, fi os.FileInfo, err error) error {
	if fi.Mode().IsDir() {
		return watcher.Add(path)
	}

	return nil
}

type Server struct{}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`:)`))
}

func main() {

	err := builder.ManagePlugins()
	if err != nil {
		log.Fatalln(err)
	}

	watcher, _ = fsnotify.NewWatcher()
	defer watcher.Close()

	if err := filepath.Walk(fmt.Sprintf("%s", configuration.GetEnv("PLUGINS_DIR")), watchDir); err != nil {
		log.Fatalln(err)
	}

	log.Println("Start lockfile verifier...")
	go func() {
		for {
			select {
			case event := <-watcher.Events:
				log.Println("PVC changes detected: ", event)
				err := builder.ManagePlugins()
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
