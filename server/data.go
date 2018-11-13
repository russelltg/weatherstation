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

// HandleData implementes http.Handler that handles /data routes
type HandleData struct {
	db *sql.DB
	ws *HandleWs
}

// WeatherRow reflects database entries
type WeatherRow struct {
	Station string `json:"station"`
	/// Time since unix epoch, utc
	Time    int64   `json:"time"`
	Sensor  string  `json:"sensor"`
	Reading float32 `json:"reading"`
}

func (h *HandleData) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":

		startStr := r.URL.Query().Get("start")
		endStr := r.URL.Query().Get("end")
		stationStr := r.URL.Query().Get("station")
		sensorStr := r.URL.Query().Get("sensor")

		if startStr == "" {
			// invalud request, must have start
			http.Error(w, "Bad request, must have start", http.StatusBadRequest)
			return
		}

		// convert start_str and end_str to integers. strconv.Atoi only
		// outputs int, but we need int64, so we have to use ParseInt
		start, err := strconv.ParseInt(startStr, 10, 64)
		if err != nil {
			http.Error(w, "Bad request, start must be a number", http.StatusBadRequest)
			return
		}

		// end is optional, so only parse it if it's not empty
		// maxiumum int64 is a sane defualt, as it will capture until the end of time
		var end int64 = math.MaxInt64
		if endStr != "" {
			end, err = strconv.ParseInt(endStr, 10, 64)
			if err != nil {
				http.Error(w, "Bad request, end must be a number", http.StatusBadRequest)
				return
			}
		}

		// convert start and end into time points. They are in seconds since the unix epoch
		startTime := time.Unix(start, 0)
		endTime := time.Unix(end, 0)

		h.handleGet(startTime, endTime, stationStr, sensorStr, w)

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

func (h *HandleData) handleGet(start time.Time, end time.Time, station string, sensor string, w http.ResponseWriter) {
	query := `SELECT station, time, sensor, reading FROM weather WHERE ? <= time AND time < ?`
	parameters := []interface{}{start.Unix(), end.Unix()}

	if station != "" {
		query += " AND station = ?"
		parameters = append(parameters, station)
	}

	if sensor != "" {
		query += " AND sensor = ?"
		parameters = append(parameters, sensor)
	}

	rows, err := h.db.Query(query, parameters...)

	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query rows: %s", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// create response, which will be a JSON array of datapoints

	ret := []WeatherRow{}

	for rows.Next() {
		row := WeatherRow{}
		err = rows.Scan(&row.Station, &row.Time, &row.Sensor, &row.Reading)
		if err != nil {
			http.Error(w, fmt.Sprintf("Faield to scan row: %s", err), http.StatusInternalServerError)
		}

		ret = append(ret, row)
	}

	// serialize the JSON
	buffer := bytes.NewBuffer([]byte{})
	jsonEncoder := json.NewEncoder(buffer)

	err = jsonEncoder.Encode(ret)
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

	log.Printf("Received new datapoint from %s, %s=%.2f", weather.Station, weather.Sensor, weather.Reading)

	// add it to the database
	_, err = h.db.Exec(`
		INSERT INTO weather
			(station, time, sensor, reading) VALUES
			(?, ?, ?)
	`, weather.Station, weather.Time, weather.Sensor, weather.Reading)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to execute sql %s", err), http.StatusInternalServerError)
		return
	}

	// send the message to the websocket subscribers
	for _, v := range h.ws.connections {
		if v.Filter(weather) {
			v.Connection.WriteJSON(weather)
		}
	}
}
