package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"strconv"
	"time"
)

type HandleData struct {
	db *sql.DB
	ws *HandleWs
}

type WeatherRow struct {
	Station string `json:"station"`
	/// Time since unix epoch, utc
	Time int64   `json:"time"`
	Temp float32 `json:"temp"`
}

func (h *HandleData) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":

		start_str := r.URL.Query().Get("start")
		end_str := r.URL.Query().Get("end")
		station_str := r.URL.Query().Get("station")

		if start_str == "" {
			// invalud request, must have start
			http.Error(w, "Bad request, must have start", http.StatusBadRequest)
			return
		}

		// convert start_str and end_str to integers. strconv.Atoi only
		// outputs int, but we need int64, so we have to use ParseInt
		start, err := strconv.ParseInt(start_str, 10, 64)
		if err != nil {
			http.Error(w, "Bad request, start must be a number", http.StatusBadRequest)
			return
		}

		// end is optional, so only parse it if it's not empty
		var end int64 = math.MaxInt64
		if end_str != "" {
			end, err = strconv.ParseInt(end_str, 10, 64)
			if err != nil {
				http.Error(w, "Bad request, end must be a number", http.StatusBadRequest)
				return
			}
		}

		// convert start and end into time points. They are in seconds since the unix epoch
		start_time := time.Unix(start, 0)
		end_time := time.Unix(end, 0)

		h.handleGet(start_time, end_time, station_str, w)

	case "POST":
		// decode the posted json
		body := r.Body
		if body == nil {
			http.Error(w, "Bad post request, no body", http.StatusBadRequest)
			return
		}
		h.handlePost(body, w)
	}
}

func (h *HandleData) handleGet(start time.Time, end time.Time, station string, w http.ResponseWriter) {
	query := `SELECT station, time, temp FROM weather WHERE ? <= time AND time < ?`

	var rows *sql.Rows
	var err error
	if station != "" {
		query += " AND station = ?"
		rows, err = h.db.Query(query, start.Unix(), end.Unix(), station)
	} else {
		rows, err = h.db.Query(query, start.Unix(), end.Unix())
	}

	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query rows: %s", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// create response, which will be a JSON array of datapoints

	ret := []WeatherRow{}

	for rows.Next() {
		row := WeatherRow{}
		err = rows.Scan(&row.Station, &row.Time, &row.Temp)
		if err != nil {
			http.Error(w, fmt.Sprintf("Faield to scan row: %s", err), http.StatusInternalServerError)
		}

		ret = append(ret, row)
	}

	// serialize the JSON
	buffer := bytes.NewBuffer([]byte{})
	json_encoder := json.NewEncoder(buffer)

	err = json_encoder.Encode(ret)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to encode json: %s", err), http.StatusInternalServerError)
	}

	// get the string back, and write it to the reponse writer
	w.Write(buffer.Bytes())
}

func (h *HandleData) handlePost(body io.Reader, w http.ResponseWriter) {

	decoder := json.NewDecoder(body)

	weather := WeatherRow{
		Time: time.Now().Unix(), // set the time to now, as the JSON doens't have time
	}
	err := decoder.Decode(&weather)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to decode json: %s", err), http.StatusBadRequest)
	}

	log.Printf("Received new datapoint: %s, %.0f deg C", weather.Station, weather.Temp)

	// add it to the database
	_, err = h.db.Exec(`
		INSERT INTO weather
			(station, time, temp) VALUES
			(?, ?, ?)
	`, weather.Station, weather.Time, weather.Temp)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to execute sql %s", err), http.StatusInternalServerError)
		return
	}

	// send the message to the websocket subscribers
	for _, v := range h.ws.connections {
		v.WriteJSON(weather)
	}
}
