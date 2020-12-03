package cloner

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/configuration"
	http2 "github.com/go-git/go-git/v5/plumbing/transport/http"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
)

var (
	currentRevision = ""
)

type Project struct {
	Name       string
	Repository string
	Path       string
}

func cloneAndOpenRepository(project Project) (*git.Repository, error) {
	gitDirOut := fmt.Sprintf("%s/%s", configuration.GetConfiguration("PLUGINS_DIR"), project.Name)

	r, err := git.PlainClone(gitDirOut, false, &git.CloneOptions{
		Auth: &http2.BasicAuth{
			Username: "abc123", // yes, this can be anything except an empty string
			Password: configuration.GetConfiguration("GIT_TOKEN"),
		},
		URL:      project.Repository,
		Progress: os.Stdout,
	})
	if err != nil && err != git.ErrRepositoryAlreadyExists {
		return nil, err
	}

	r, err = git.PlainOpen(gitDirOut)
	if err != nil {
		return nil, err
	}

	return r, nil
}

func getRevisionDiff(r *git.Repository) (string, error) {
	w, err := r.Worktree()
	if err != nil {
		return "", err
	}

	err = w.Pull(&git.PullOptions{RemoteName: "origin"})
	if err != nil && err != git.NoErrAlreadyUpToDate {
		return "", err
	}

	h, err := r.ResolveRevision(plumbing.Revision("HEAD"))
	if err != nil {
		return "", nil
	}

	if currentRevision != h.String() {
		currentRevision = h.String()
		return h.String(), nil
	}

	return "", nil
}

func initializeRevision(r *git.Repository) error {
	p, err := r.Head()
	if err != nil {
		return err
	}

	currentRevision = p.Hash().String()
	return nil
}

func sync(r *git.Repository) error {
	d, err := getRevisionDiff(r)
	if err != nil {
		return nil
	}

	if d != "" {
		// TODO: sync logic
		fmt.Println("EVENT")
		return nil
	}

	return nil
}

func getInterval() (time.Duration, error) {
	return time.ParseDuration("15s")
}

func SyncGitOps() {
	resync := make(chan bool)
	projects := []Project{
		{
			Name:       "plugins",
			Repository: fmt.Sprintf("%s", configuration.GetConfiguration("PLUGINS_REPO")),
		},
	}

	interval, err := getInterval()
	if err != nil {
		log.Fatalln(err)
	}

	for _, project := range projects {
		r, err := cloneAndOpenRepository(project)
		if err != nil {
			log.Fatalln(err)
		}

		err = initializeRevision(r)
		if err != nil {
			log.Fatalln(err)
		}

		go func() {
			fmt.Println("Start gitops engine...")
			ticker := time.NewTicker(interval)
			for {
				select {
				case <-ticker.C:
					err := sync(r)
					if err != nil {
						log.Fatalln(err)
					}
					fmt.Println("Oh shit, here we go again")
				case <-resync:
					err := sync(r)
					if err != nil {
						log.Fatalln(err)
					}
					fmt.Println("Oh shit, here we are")
				}
			}
		}()
	}

	http.HandleFunc("/sync", func(w http.ResponseWriter, r *http.Request) {
		resync <- true
	})

	fmt.Println("Start server on 8080...")
	log.Println(http.ListenAndServe(":8080", nil))
}
