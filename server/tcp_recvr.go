package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"log"
	"net"
	"sync/atomic"
	"time"
)

type TcpRecvr struct {
	url  string
	data *HandleData
	// atomic
	cancelFlag int32
}

func NewTcpRecvr(url string, data *HandleData) *TcpRecvr {
	return &TcpRecvr{
		url,
		data,
		0,
	}
}

func (t *TcpRecvr) Cancel() {
	atomic.StoreInt32(&t.cancelFlag, 1)
}

func (t *TcpRecvr) Receive() {
	for {
		if atomic.LoadInt32(&t.cancelFlag) == 1 {
			break
		}

		conn, err := net.Dial("tcp", t.url+":2000")
		if err != nil {
			continue
		}
		scanner := bufio.NewScanner(conn)

		for scanner.Scan() {

			if atomic.LoadInt32(&t.cancelFlag) == 1 {
				break
			}

			scanner.Text()
			decoder := json.NewDecoder(bytes.NewBufferString(scanner.Text()))
			weather := WeatherRow{
				Time: time.Now().Unix(),
			}
			err = decoder.Decode(&weather)
			if err != nil {
				log.Printf("Failed to decode JSON from %v: %s", t.url, err)
				continue
			}

			err = t.data.handleNewData(weather)
			if err != nil {
				log.Printf("Failed to handle new row: %s", err)
			}
		}
	}
}
