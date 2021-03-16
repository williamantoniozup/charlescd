package main

import (
	"github.com/joho/godotenv"
	"log"
)

func main() {
	godotenv.Load("./resources/.env")

	persistenceManager, err := prepareDatabase()
	if err != nil {
		log.Fatal(err)
	}

	server, err := newServer(persistenceManager)
	if err != nil {
		log.Fatal(err)
	}

	log.Fatalln(server.start("8080"))
}