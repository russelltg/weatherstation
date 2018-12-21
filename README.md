# Arduino Weather Station (HyperStation)

[![HitCount](http://hits.dwyl.com/{username}/{project-name}.svg)](http://hits.dwyl.com/{username}/{project-name})
![](https://img.shields.io/badge/built%20for-Tumaini%20Innovation%20Center-brightgreen.svg)
![](https://img.shields.io/badge/built%20by-St.%20Anchormould-brightgreen.svg)

This repository houses an arduino based weather station. It has lesson plans to teach students everything from the basics of coding up to how to set up an internet connected weather station.

An introductory video describing the project can be found [here](https://www.youtube.com/watch?v=sxOYXKh8s5U)

To get started, head over to [`lessons`](lessons)->[`lesson1.md`](lessons/lesson1.md). Or, if you would like to see all of the lessons and the general lesson plan, visit the readme file for the lessons [here](lessons/README.md).

If you are just looking to connect to the hyperlocal weather station network, visit [`lesson 8`](lessons/lesson8.md).

## Required Hardware

* Computer with the arduino IDE installed
* Arduino Uno
* USB cable for connection to a PC
* Raspberry pi
* Micro SD card
* Battery pack
* LCD panel
* DHT22 temperature and wind sensor
* Adafruit wind sensor
* Breadboard
* Jumper cables
* HDMI monitor + cable
* USB Keyboard
* microSD card reader


## Directory Structure

### `lessons`

The `lessons` directory houses the lessons that will teach students the basics of arduino programming. These lessons will then take them all the way through the creation of both a simple and complex weather station as they gain more and more knowlede about arduino programming. This is where students and teachers should start.

### `arduino`

The `arduino` directory contains two `.ino` C++ files, one for a simple solution, and another for the more complex solution that streams data to a server. Both of these solutions are described below. Students should use the files in this director

### `server`

The `server` directory contains the source files for a server that receives sensor data from the arduino weather station and can then serve and stream the data to web clients. It is written in
 [Golang](https://golang.org).

### `data-visualizer`

The `data-visualizer` directory contains the source files for the web client. It is written in Typescript with the React framework, using the material-ui component kit.

## Solution Descriptions

### The minimal solution

The minimal solution is just a arduino with sensors, and an LCD panel to show the sensor data. It it a great introductory project to arduino, and has some real-world usability.

### The server solution

This solution is much more complex, but also teaches a more diverse skillset and is much more useful to the students and the community as a final product. This solution begins in [`lesson 6`](lessons/lesson6.md).

## Lesson plans
The lesson plans can be found under [`lessons`](lessons/README.md).

## Assignments
There are assignments to go along with lesson plans in the [lessons](lessons) directory. The keys are located in the [arduino](arduino/assigmentkeys), but are only for teachers to use. Visit the [lessons README.md](lessons/README.md) for more information.

## Help
If you encounter issues with the arduino, you can visit the [`issues page`](lessons/issues.md) at `lessons`->`issues.md` for some tips on fixing your issues quickly.
