package main

import (
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
)

type HandleWs struct {
	upgrader    websocket.Upgrader
	connections map[net.Addr]*websocket.Conn
}

func (h *HandleWs) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Printf("Websocket Connected: %s", r.RemoteAddr)

	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to upgrade websocket: %s", err), http.StatusInternalServerError)
	}
	addr := conn.RemoteAddr()
	h.connections[addr] = conn
	conn.SetCloseHandler(func(code int, message string) error {
		log.Printf("Websocket disconnected: %s", r.RemoteAddr)
		delete(h.connections, addr)
		return nil
	})
}
