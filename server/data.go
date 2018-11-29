package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"
	"time"
)

// HandleData implementes http.Handler that handles /data routes
type HandleData struct {
	db     *sql.DB
	ws     *HandleWs
	recvrs map[string]*TcpRecvr
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
		datawidth := r.URL.Query().Get("datawidth")

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

		h.handleGet(startTime, endTime, stationStr, sensorStr, datawidth, w)
	case "DELETE":
		// remove all rows from the database
		query := `DELETE FROM weather`
		_, err := h.db.Exec(query)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete all rows: %s", err), http.StatusInternalServerError)
			return
		}
	}
}

func (h *HandleData) handleGet(start time.Time, end time.Time, station string, sensor string, datawidth string, w http.ResponseWriter) {
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
	if datawidth != "" {
		query += " ORDER BY station, sensor"
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
			return
		}

		ret = append(ret, row)
	}

	// process the data
	if datawidth != "" && len(ret) != 0 {

		// read it as a integer
		datawidthInt, err := strconv.Atoi(datawidth)
		if err != nil {
			http.Error(w, fmt.Sprintf("maxpts parameter must be a integer, %s", err), http.StatusBadRequest)
			return
		}

		newRet := []WeatherRow{}

		for i := 0; i < len(ret); {
			startTime := ret[i].Time
			thisStation := ret[i].Station
			thisSensor := ret[i].Sensor

			runningTime := startTime
			runningReading := ret[i].Reading
			count := int64(1)

			i++

			for i < len(ret) &&
				ret[i].Sensor == thisSensor &&
				ret[i].Station == thisStation &&
				ret[i].Time < startTime+int64(datawidthInt) {

				runningTime += ret[i].Time
				runningReading += ret[i].Reading

				count++
				i++
			}

			newRet = append(newRet, WeatherRow{
				thisStation,
				runningTime / count,
				thisSensor,
				runningReading / float32(count),
			})
		}
		ret = newRet
	}

	// serialize the JSON
	buffer := bytes.NewBuffer([]byte{})
	jsonEncoder := json.NewEncoder(buffer)

	err = jsonEncoder.Encode(ret)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to encode json: %s", err), http.StatusInternalServerError)
	}

	// get the string back, and write it to the reponse writer
	w.Header().Add("Content-Type", "application/json")
	w.Write(buffer.Bytes())
}

// Handle new data that has been sent
func (h *HandleData) handleNewData(weather WeatherRow) error {

	log.Printf("Received new datapoint from %s, %s=%.2f", weather.Station, weather.Sensor, weather.Reading)

	// add it to the database
	_, err := h.db.Exec(`
		INSERT INTO weather
			(station, time, sensor, reading) VALUES
			(?, ?, ?, ?)
	`, weather.Station, weather.Time, weather.Sensor, weather.Reading)
	if err != nil {
		return fmt.Errorf("Failed to execute sql %s", err)
	}

	// send the message to the websocket subscribers
	for _, v := range h.ws.connections {
		if v.Filter(weather) {

			v.Connection.WriteJSON(weather)
		}
	}
	return nil
}

func (h *HandleData) AddTcpRecvr(ip string, name string) {
	h.recvrs[name] = NewTcpRecvr(ip, name, h)
	go h.recvrs[name].Receive()
}

func (h *HandleData) StartTcpRecvrsFromDb() {
	query := `
		SELECT ip, name
		FROM stations
	`
	rows, err := h.db.Query(query)
	if err != nil {
		log.Printf("Failed to execute query: %s", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var ip string
		var name string
		err := rows.Scan(&ip, &name)
		if err != nil {
			log.Printf("Failed to scan row: %s", err)
			continue
		}
		h.AddTcpRecvr(ip, name)
	}
}
