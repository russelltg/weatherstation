package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type SensorsHandler struct {
	db *sql.DB
}

func (h *SensorsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, fmt.Sprintf("Invalid HTTP method %s for endpoint /sensors", r.Method), http.StatusBadRequest)
		return
	}

	query := `SELECT DISTINCT sensor FROM weather`
	rows, err := h.db.Query(query)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query database: %s", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	sensors := []string{}
	for rows.Next() {
		var sensor string
		rows.Scan(&sensor)

		sensors = append(sensors, sensor)
	}

	// seralize the slice
	buffer := bytes.NewBuffer([]byte{})
	jsonEncoder := json.NewEncoder(buffer)

	err = jsonEncoder.Encode(sensors)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to encode JSON: %s", err), http.StatusInternalServerError)
		return
	}

	w.Write(buffer.Bytes())
}
