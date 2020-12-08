package cloner

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/builder"
	"github.com/ZupIT/charlescd/compass/sidecar/configuration"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	http2 "github.com/go-git/go-git/v5/plumbing/transport/http"
	"log"
	"os"
)

var (
	currentRevision = ""
)

type Project struct {
	Name        string
	Credentials *git.Repository
	Repository  string
	Path        string
}

func CloneAndOpenRepository(project Project) (*git.Repository, error) {
	gitDirOut := fmt.Sprintf("%s", configuration.GetEnv("PLUGINS_DIR"))

	r, err := git.PlainClone(gitDirOut, false, &git.CloneOptions{
		Auth: &http2.BasicAuth{
			Username: "abc123", // yes, this can be anything except an empty string
			Password: configuration.GetEnv("GIT_TOKEN"),
		},
		URL:      project.Repository,
		Progress: os.Stdout,
	})
	if err != nil {
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
		log.Println("Worktree error: ", err)
		return "", err
	}

	err = w.Pull(&git.PullOptions{
		RemoteName: "origin",
		Auth: &http2.BasicAuth{
			Username: "abc123", // yes, this can be anything except an empty string
			Password: configuration.GetEnv("GIT_TOKEN"),
		},
	})
	if err != nil && err != git.NoErrAlreadyUpToDate {
		return "", err
	}

	h, err := r.ResolveRevision(plumbing.Revision("HEAD"))
	if err != nil {
		return "", err
	}

	if currentRevision != h.String() {
		currentRevision = h.String()
		return h.String(), nil
	}

	return "", nil
}

func InitializeRevision(r *git.Repository) error {
	p, err := r.Head()
	if err != nil {
		return err
	}

	currentRevision = p.Hash().String()
	return nil
}

func Sync(r *git.Repository) error {
	d, err := getRevisionDiff(r)
	if err != nil {
		log.Println("Sync error: ", err)
		return nil
	}

	if d != "" {
		log.Println("GitHub changes detected")

		err := builder.RemovePlugins(false)
		if err != nil {
			log.Println("Could not remove old plugins:", err)
			return err
		}

		err = builder.ManagePlugins()
		if err != nil {
			log.Println("Build error:", err)
			return err
		}

		log.Println("Plugins are built!")
		return nil
	}

	log.Println("No changes detected")
	return nil
}

//func SyncGitOps() {
//	resync := make(chan bool)
//	project := Project{
//		//Name:       "plugins",
//		Repository: fmt.Sprintf("%s", configuration.GetEnv("PLUGINS_REPO")),
//	}
//
//	interval, err := getInterval()
//	if err != nil {
//		log.Fatalln(err)
//	}
//
//	for _, project := range projects {
//		r, err := cloneAndOpenRepository(project)
//		if err != nil {
//			log.Fatalln(err)
//		}
//
//		err = initializeRevision(r)
//		if err != nil {
//			log.Fatalln(err)
//		}
//
//		go func() {
//			fmt.Println("Start gitops engine...")
//			ticker := time.NewTicker(interval)
//			for {
//				select {
//				case <-ticker.C:
//					err := sync(r)
//					if err != nil {
//						log.Fatalln(err)
//					}
//					fmt.Println("Oh shit, here we go again")
//				case <-resync:
//					err := sync(r)
//					if err != nil {
//						log.Fatalln(err)
//					}
//					fmt.Println("Oh shit, here we are")
//				}
//			}
//		}()
//	}
//
//	http.HandleFunc("/sync", func(w http.ResponseWriter, r *http.Request) {
//		resync <- true
//	})
//
//	fmt.Println("Start server on 8080...")
//	log.Println(http.ListenAndServe(":8080", nil))
//}
