# Lesson 1: Setting up the Arduino IDE and tour of the Arduino [~10 minutes]

In order to install arduino code onto an arduino, you need the Arduino IDE (Integrated Development Environment),
which allows you to program arduino applications and install them onto arduino.
Installer packages can be found on the [arduino site](https://www.arduino.cc/en/Main/Software#download).

Next, plug in the arduino to the computer that the Arduino IDE was installed on. Lights should come up on the arduino, indicating that it has power.

Next, start the IDE, it should look like this:

![Basic IDE](images/IDE.png)

## Tour of the Arduino IDE

| Section of the IDE | Name                | Description                                                           |
| ------------------ | ------------------- | --------------------------------------------------------------------- |
| ![](images/Verify.png)    | Verify              | Verifies your code, notifying of any syntax errors                    |
| ![](images/Upload.png)    | Upload              | Upload code to the arduino, and run the code                          |
| ![](images/New.png)       | New Sketch          | Opens a new empty sketch in a new window                              |
| ![](images/OpenSave.png)  | Open/Save           | Open or save a sketch, respectively                                   |
| ![](images/SerialMon.png) | Open Serial Monitor | Open the serial monitor                                               |
| ![](images/Tabs.png)      | File tabs           | If you have multiple files open in one window, they will show as tabs |
| ![](images/CodeArea.png)  | Code Area           | The code area, where you will write your code                         |

## Selecting your device

Next, you need to tell the IDE to look for your device. In order to do that,
Click the `Tools` dropdown menu, and go to `Port`. Select your arduino board.

![](images/Tools-BoardSelect.PNG)

## Tour of Arduino Coding - Hello World

As the comments indicate, it will run the code in the `setup` function
once when the program is started, and then runs the code in `loop` over and
over, forever.

The lines that start with `//` are called *comments*, and are ignored. It is considered good practice to
put comments around relative complex pieces of code so someone can read your code better.

If you press the upload button (the right arrow), it will upload the code
to the arduino (provided that the correct device is selected under `Tools->Port`). Nothing will happen, as there
is no code in the `setup` or `loop` functions, but do so anyway to
make sure that there are no errors.

When you press upload, it will prompt you to choose a directory to
save your sketch in. Choose wherever you desire, the default location
works fine.

In order to get the arduino to do something, we need to add code. In the `setup` function, add the following lines of code between the `{` and `}`
after `setup`:

```C++
Serial.begin(9600); // Set the baud rate for the serial connection
Serial.println("Hello World!"); // Send the message 'Hello World!' over serial.
```

so that the whole file looks like:

```C++
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Hello World!");
}

void loop() {
  // put your main code here, to run repeatedly:
}
```

The computer and the arduino are connected over a serial connection so they can share data. If you are curious
about how this all works under the hood, you can [read this wikipedia article](https://en.wikipedia.org/wiki/Asynchronous_serial_communication).

Regardless, upload the code to the arduino using the upload button (![](Upload.png)) then open the serial monitor (![](SerialMon.png)). In the serial monitor, set the baud rate to 9600:

TODO INSERT IMAGE

In the serial monitor, you should see `Hello World`:

TODO INSERT IMAGE

## Tour of the Arduino

![](images/Arduino.jpg)
> Image source: https://store.arduino.cc/usa/arduino-uno-rev3

On the top of the arduino, there are digital input and output pins, labeled from 0 to 13,
making for 14 digital pins total. Digital means that the pins will represent either a 1
or a 0, so either some positive voltage (for a 1) or a zero voltage (for a zero).

On the lower right, there is the analog pins, labeled A0 through A5, for 6 pins.
Analog pins input a voltage that varies between 0 and 1.

In this project you will use both digital and analog pins.

On the lower middle of the arduino, there is the power section, which provides ground pins and pins
that are +5V and +3.3V with respect to ground. These will be used later when wiring up various sensors.

You can continue with lesson 2 [here](lesson2).
