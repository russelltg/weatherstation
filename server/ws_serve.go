package main

import (
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
)

type WsConn struct {
	Connection *websocket.Conn
	Filter     func(WeatherRow) bool
}

type HandleWs struct {
	upgrader    websocket.Upgrader
	connections map[net.Addr]WsConn
}

func (h *HandleWs) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	// filters
	stationStr := r.URL.Query().Get("station")
	sensorStr := r.URL.Query().Get("sensor")

	log.Printf("Websocket Connected: %s", r.RemoteAddr)

	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to upgrade websocket: %s", err), http.StatusInternalServerError)
	}
	addr := conn.RemoteAddr()
	h.connections[addr] = WsConn{
		conn,
		func(row WeatherRow) bool {
			if stationStr != "" {
				if row.Station != stationStr {
					return false
				}
			}
			if sensorStr != "" {
				if row.Sensor != sensorStr {
					return false
				}
			}
			return true
		},
	}
	conn.SetCloseHandler(func(code int, message string) error {
		log.Printf("Websocket disconnected: %s", r.RemoteAddr)
		delete(h.connections, addr)
		return nil
	})
}
