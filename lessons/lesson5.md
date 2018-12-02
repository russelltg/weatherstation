In order to write code for the arduino, we must first setup the circuit. The following is a circuit diagram for the setup.

![arduino_simple.png](../arduino/Schematics/arduino_simple.png)

Each green line shows where a cable is to go on the actual circuit. In this scenario, the use on a breadboard looks slightly different. We need to connect two sensors (`DHT22` and `LCD I2C`) to 5V power, but the arduino only has one pin for this. Therefore, the arduino 5V power should be sent to the '+' rail of the breadboard, and each 5V power pin on the sensors should be connected to that '+' rail.

//1
These are pre-processor statements. They allow us to add
lots of lines of code to the beginning of our own code rather
than adding it all in on our own. This code is contained in
"header" files. Basically, header files contain code that is
often called by more than one sketch. Therefore, it is easier
to add one line to the code than rewriting all of the header
file into our sketch

//2
These are #define statements. They will allow the user to
create some name with a value. For instance, when "DHT_PIN"
is put into a line of code, the value 7 will be put in its
place. This stops the user from having to put the number 7
in every time this value is needed. Also, it does not require
a variable declaration, which makes it easier.

//3
These lines will initialize certain things by calling code
in the header files. Essentially, we are telling the code
"we have a DHT22 based sensor on pin 7". Using this information,
the software can now talk to the sensor. These lines make
our individual parts available for use.

 //4
This is a variable declaration. This will allow us to call
this number in the code without us having to type this number
more than once.

//5
These are functions. They allow us to tell the computer what to
do. They follow this basic structure. They can be called from
inside the program, meaning we can write a function once and
use it multiple times. This strategy is often used to make
the "main" function (the code that the computer starts running)
very simple. In this case, the code that makes the sensors read
the values will be placed here to make the code inside "loop"
very simple. The first word is what the function returns. In other
words, the function will run and will spit something out. In the
case of these functions, a "float" will come from the function.
A "float" is a number with a decimal point (like 1.12345). The
second part is the name. This is what you would like the function
to be referred to. The "()" will not be used here, and is slightly
more advanced, so it will be left out for now. Finally, a "{ }"
is used. This is where the code the function will run will go.

//6
windRead() is a complicated function. Don't worry too much
about how this works quite yet.

//7
The setup() function is where the user can setup everything for
the code. This function runs only one time. Keep in mind, none
of the above functions ran before this point! Use setup() and
later, loop() to call the functions above to make the code run!

//8
The loop() function is where the user can define a set of code
that will be run continuously. This code will loop, as the name
suggests, so this is where the sensors will actually read data
and where the LCD will be set to display the results. Keep in
mind, both loop() and setup() need to be 'void'!
