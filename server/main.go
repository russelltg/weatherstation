package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gobuffalo/packr"

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
		sqlWeather := `CREATE TABLE weather (
				id INTEGER NOT NULL PRIMARY KEY, 
				station TEXT, 
				time UNSIGNED BIG INT, 
				sensor TEXT, 
				reading REAL
			)`
		_, err = db.Exec(sqlWeather)
		if err != nil {
			log.Fatal(err)
		}

		sqlStations := `
			CREATE TABLE stations (
				id INTEGER NOT NULL PRIMARY KEY,
				name TEXT,
				ip TEXT
			)
		`
		_, err = db.Exec(sqlStations)
		if err != nil {
			log.Fatal(err)
		}

	}

	return db
}

func main() {
	db := setupDatabase()
	defer db.Close()

	wshandler := NewHandleWs()

	box := packr.NewBox("../data-visualizer/build")

	dataHandle := &HandleData{db, wshandler, map[string]*TcpRecvr{}}
	dataHandle.StartTcpRecvrsFromDb()

	// http.Handle("/stations", &StationsHandle{db})
	http.Handle("/stations", &StationsHandler{db, dataHandle})
	http.Handle("/sensors", &SensorsHandler{db})
	http.Handle("/data", dataHandle)
	http.Handle("/ws", wshandler)
	http.Handle("/", http.FileServer(box))

	log.Printf("Starting server on port 8080")
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}
