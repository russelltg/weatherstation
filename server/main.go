package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func setupDatabase() *sql.DB {

	// see if the database already exists
	_, err := os.Stat("./data.db")
	dbExists := !os.IsNotExist(err)

	// open the database
	db, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		log.Fatal(err)
	}

	// if the database does not exist, then create the table we need in it
	if !dbExists {
		// create the data table of the format:
		// KEY (id) | Station Name (string) | Time (integer, secs since unix epoch) | Temp (float, deg C)
		sql := "CREATE TABLE weather (id INTEGER NOT NULL PRIMARY KEY, station TEXT, time UNSIGNED BIG INT, temp REAL)"
		_, err = db.Exec(sql)
		if err != nil {
			log.Fatal(err)
		}
	}

	return db
}

func main() {
	db := setupDatabase()
	defer db.Close()

	http.Handle("/data", &HandleData{db})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
