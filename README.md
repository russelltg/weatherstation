# Arduino Weather Station

This repository has code to setup an arduino weather station that
streams realtime sensor data to a server, which can be connected to via
a web browser for visualization

## Required Hardware

* Arduino Uno
* 

## Directory Structure

### `arduino`

The `arduino` directory contains two `.ino` C++ files, one for a simple
solution, and another for the more complex solution that streams data to
a server. Both of these solutions are described below.

### `server`

The `server` directory contains the source files for a server that
receives sensor data from the arduino weather station and can
then serve and stream the data to web clients. It is written in
 [Golang](https://golang.org).

### `data-visualizer`

The `data-visualizer` directory contains the source files for the web
client. It is written in Typescript with the React framework, using the
material-ui component kit.

## Solution Descriptions

### The minimal solution

The minimal solution is just a arduino with sensors, and an LCD panel
to show the sensor data. It it a great introductory project to arduino,
and has some real-world usability. 

### The server solution

This solution is much more complex, but also teaches a more diverse
skillset and is much more useful to the students and the community
as a final product


## Lesson plans
The lesson plans can be found under [`lessons`](lessons).
