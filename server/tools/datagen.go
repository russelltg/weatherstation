package main

import (
	"database/sql"
	"math"
	"math/rand"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	db, err := sql.Open("sqlite3", "../data.db")
	if err != nil {
		panic(err)
	}

	start := time.Now().Unix() - 3600*24

	for i := int64(0); i < 6*60*24; i++ {
		_, err := db.Exec(`INSERT INTO weather 
			(station, time, sensor, reading) VALUES
			(?, ?, ?, ?)`,
			"teststation", start+i*10, "temp", math.Abs(rand.NormFloat64()*25+6))
		if err != nil {
			panic(err)
		}
	}
}
