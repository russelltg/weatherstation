package main

import (
	"database/sql"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gorilla/websocket"

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
		sql := `CREATE TABLE weather (
				id INTEGER NOT NULL PRIMARY KEY, 
				station TEXT, 
				time UNSIGNED BIG INT, 
				sensor TEXT, 
				reading REAL
			)`
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

	wshandler := &HandleWs{
		websocket.Upgrader{},
		map[net.Addr]WsConn{},
	}

	http.Handle("/sensors", &SensorsHandler{db})
	http.Handle("/data", &HandleData{db, wshandler})
	http.Handle("/ws", wshandler)

	log.Printf("Starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
