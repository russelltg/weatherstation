package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"
)

type HandleData struct {
	db *sql.DB
}

type WeatherRow struct {
	Station string    `json:"station"`
	Time    time.Time `json:"time"`
	Temp    float32   `json:"temp"`
}

func (h *HandleData) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	log.Printf("HTTP Method: '%s'", r.Method)

	switch r.Method {
	// apparently empty string means GET
	case "", "GET":

		start_str := r.URL.Query().Get("start")
		end_str := r.URL.Query().Get("end")

		if start_str == "" || end_str == "" {
			// invalud request, must have start and end
			http.Error(w, "Bad request, must have start and end", http.StatusBadRequest)
			return
		}

		// convert start_str and end_str to integers. strconv.Atoi only
		// outputs int, but we need int64, so we have to use ParseInt
		start, err := strconv.ParseInt(start_str, 10, 64)
		if err != nil {
			http.Error(w, "Bad request, start must be a number", http.StatusBadRequest)
			return
		}

		end, err := strconv.ParseInt(end_str, 10, 64)
		if err != nil {
			http.Error(w, "Bad request, end must be a number", http.StatusBadRequest)
			return
		}

		// convert start and end into time points. They are in seconds since the unix epoch
		start_time := time.Unix(start, 0)
		end_time := time.Unix(end, 0)

		h.handleGet(start_time, end_time, w)

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

func (h *HandleData) handleGet(start time.Time, end time.Time, w http.ResponseWriter) {
	rows, err := h.db.Query(`
		SELECT station, time, temp FROM weather WHERE ? < time AND time < ?
	`, start.Unix(), end.Unix())
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query rows: %s", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// create response, which will be a JSON array of datapoints

	ret := []WeatherRow{}

	for rows.Next() {
		var t int64
		row := WeatherRow{}
		err = rows.Scan(&row.Station, &t, &row.Temp)
		row.Time = time.Unix(t, 0)
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
		Time: time.Now(), // set the time to now, as the JSON doens't have time
	}
	err := decoder.Decode(&weather)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to decode json: %s", err), http.StatusBadRequest)
	}

	// add it to the database
	_, err = h.db.Exec(`
		INSERT INTO weather
			(station, time, temp) VALUES
			(?, ?, ?)
	`, weather.Station, weather.Time.Unix(), weather.Temp)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to execute sql %s", err), http.StatusInternalServerError)
		return
	}
}
