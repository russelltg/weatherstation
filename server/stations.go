package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type StationsHandler struct {
	db   *sql.DB
	data *HandleData
}

type stationsRow struct {
	Name string `json:"name"`
	IP   string `json:"ip"`
}

func (h *StationsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	name := r.URL.Query().Get("name")
	ip := r.URL.Query().Get("ip")

	switch r.Method {
	case "GET":
		query := `
			SELECT name, ip
			FROM stations
		`
		rows, err := h.db.Query(query)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to query DB: %s", err), http.StatusInternalServerError)
			return
		}
		stations := []stationsRow{}
		for rows.Next() {
			var row stationsRow
			err = rows.Scan(&row.Name, &row.IP)
			if err != nil {
				http.Error(w, fmt.Sprintf("Failed to scan DB: %s", err), http.StatusInternalServerError)
			}
			stations = append(stations, row)
		}
		outJSON := bytes.NewBuffer([]byte{})
		encoder := json.NewEncoder(outJSON)
		err = encoder.Encode(stations)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to encode JSON: %s", err), http.StatusInternalServerError)
		}
		w.Write(outJSON.Bytes())
	case "PUT":
		if name == "" {
			http.Error(w, "Empty name parameter", http.StatusBadRequest)
			return
		}
		if ip == "" {
			http.Error(w, "Empty IP parameter", http.StatusBadRequest)
			return
		}

		// see if it already exists
		query := `
			SELECT name, ip
			FROM stations
			WHERE name = ? OR ip = ?
		`
		rows, err := h.db.Query(query, name, ip)
		if rows.Next() {
			var aeName string
			var aeIP string
			rows.Scan(&aeName, &aeIP)
			http.Error(w, fmt.Sprintf("Station with same ip or port already exists -- already existing station: %s(%s) -- tryed to add: %s(%s)",
				aeName, aeIP, name, ip), http.StatusConflict)
			return
		}

		query = `
			INSERT INTO stations 
			(name, ip) VALUES
			(?, ?)
		`
		_, err = h.db.Exec(query, name, ip)
		if err != nil {
			http.Error(w, fmt.Sprintf("Faield to execute SQL: %s", err), http.StatusInternalServerError)
			return
		}

		// start it
		h.data.AddTcpRecvr(ip)

		log.Printf("Added Station: IP=%s, name=%s", ip, name)

	case "DELETE":
		if name == "" {
			http.Error(w, "Empty name parameter", http.StatusBadRequest)
			return
		}
		query := `
				DELETE FROM stations WHERE name=?
			`
		res, err := h.db.Exec(query, name)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete station: %s", err), http.StatusInternalServerError)
			return
		}
		rows, err := res.RowsAffected()
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get rows affected: %s", err), http.StatusInternalServerError)
			return
		}
		if rows == 0 {
			http.Error(w, fmt.Sprintf("Tryed to delete station: %s, did not exist", name), http.StatusNotFound)
			return
		}
	}
}
