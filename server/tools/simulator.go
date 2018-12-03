package main

import (
	"bufio"
	"fmt"
	"math"
	"math/rand"
	"net"
	"time"
)

func main() {
	list, err := net.Listen("tcp", "127.0.0.1:2000")
	if err != nil {
		panic(err)
	}

	for {
		conn, err := list.Accept()
		if err != nil {
			panic(err)
			continue
		}

		go func() {
			bufw := bufio.NewWriter(conn)

			for {

				bufw.WriteString(fmt.Sprintf(`{"sensor": "temp", "reading": %f}`+"\n", math.Abs(rand.NormFloat64()*6+25)))
				bufw.Flush()

				time.Sleep(time.Second * 10)
			}
		}()
	}
}
