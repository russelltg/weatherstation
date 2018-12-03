# Lesson 3: Learning the basics of coding [~30 minutes]
This lesson will teach the basics of coding with the goal of setting up a weather station in the future. It will cover functions, variables, and general operating lines of code and how to use each.

By the end of this tutorial, you will be able to read code and understand the basic functions, as well as write some of your own code.

Let's get started!

### Step one:

In order to set up a simple weather station, we must first know the basics of coding. This tutorial will show you these basics. From there, you will work on a challenge to show mastery over these basic topics.

#### *Variables*

Variables are ways to store data. Since not every value used in code is constant, variables must be used to define data. Essentially, you are asking the computer to remember the name of something that you can assign any value to. It's as if you ask your friend to remember the letter x. You then tell them that x = 4. X could be any number, but since you declared it to be 4, your friend will remember it as such. This is how variables work in coding. You will assign a name to a variable and a value. This variable can then store any value inside it (with some exceptions). This is how a variable works in coding:

```C++
int x = 4;
int y = 6;
bool a = true;
float b;
```

Here we have a variable that is an integer that is called x. x is declared to be 4. We also have an integer variable y that is declared to by 6. Next, there is a boolean variable that is declared to be true. Finally, there is a floating point number called b that does not have a value assigned to it. For each variable, you must determine what type of variable it is to be. This is like telling your friend, "I want you to remember a number". It wouldn't make sense to tell your friend a sentence after telling them you want them to remember a number, and computers work the same way. You must tell them what kind of data you want them to store in a variable.
There are many types of variables you can declare something to be, and they are listed below. Note: These are just basic variable declarations.

|Type |Name                |Range|
|------|:-------------------:|-----:|
|*int*   |integer              |+/- 32,767|
|*float* |floating point number|+/- 3.4e +/-38|
|*bool*  |boolean variable     |true or false|
|*char*  |character            |One single character|
|*double*|double               |+/- 1.7e +/- 308|
|*wchar_t*|wide character |1 wide character|

These values are what go before the name of the variable to determine what that variable can hold. Each variable can be defined using the structure `type name = value;`. This is exactly the structure used in the examples above. Using these basic variable types, we can calculate a lot of values in out code.

#### *Functions*

Functions are what does something in coding. A function is like a task. For instance, a function could be something like cleaning a room. In order to clean a room, many things must be done. But, if you want someone to clean a room, you don't tell them to do the individual tasks; you simply ask them to clean the room. Functions work in this way.

###### How to declare a function

A function declaration looks like this:
```C++
void loop() {
  //Some code here
}
```
As you can see here, we have a function named ``loop``. This function is of type ``void`` and contains one comment inside, ``//Some code here``. A function always begins with a return type. This is something the function spits out. Think of this as an output. If you ask someone to clean a room, you might expect them to tell you they did this. This is essentially what the type does. `void` returns nothing. This would be like someone not telling you they cleaned the room. `int` would return an integer. This would be like a friend telling you "116" after cleaning a room. It just wouldn't make sense! So, for each function, the correct return type must be used. In arduino, functions named `loop()` and `setup()` must always have the return type `void`.

The `()` of a function is what the function inputs. For instance, you might tell a friend, "clean the kitchen". In order for them to clean, they must know where. This is what would go inside the `()` to tell the function what to do.

The final part to a function is the `{ }`. This is simple where the code goes. Every function must have a starting brace and an ending brace, but not more than one of each.

Any line that begins with `//` is a comment. This is not code. You can type anything you want here and it will be ignored. This is simply for helping you understand the code better.

***

So, what do we know about this function?
```C++
int cleanTheRoom(int roomNumber) {
  //Clean room 'roomNumber'
  //Return 1
}
```
1. This function has a return type of `int`. It will spit out an integer when complete.
2. The function is named `cleanTheRoom`.
3. The function requires an `int` named `roomNumber` as an input to function.

So, we just defined a function. This function can then be *called* when we want it to. This means that the code inside of the function will run, but it won't run at the exact spot that it is actually written. Take a look at this code for instance:

```C++
int cleanTheRoom(int roomNumber) {
  Serial.println("Room Clean!");
}

void setup() {
  Serial.println("The room is not clean!");
  //Clean room #1!
  cleanTheRoom(1);
}
```

For reference, it must be said that `Serial.println()` will print whatever is inside the `()` to the output. What is to be printed must be inside a set of `""`. Now, notice that the first thing the code will do is not say `Room Clean!`. Since this code is in a function we defined, it is not run until we call it. Notice that inside `void setup()`, we call the function `cleanTheRooom(1)` after printing `The room is not clean!`. This is because we must call the function at some point with the correct inputs in order for it to run!

---

***WARNING!!!! ALL LINES OF CODE THAT ARE NOT PREPROCESSOR STATEMENTS NOR FUNCTIONS MUST HAVE A SEMICOLON ENDING THEM!!!! YOU WILL GET ERRORS IF THIS IS NOT MET!!!!***

---

#### Preprocessor statements

Preprocessor statements are ways to simplify code by adding large blocks of code at the beginning of what we write. Preprocessor statements are defined using a `#` and usually call for a file that we want to use. For instance, take a look at the following code:
```C++
#include "DHT.h"
#include <LiquidCrystal.h>
```
These statements will open the files `DHT.h` and `LiquidCrystal.h`. The idea is that both of these have a lot of functions in these. By adding these two lines, we add all the functions in these files to the beginning of our code and can, therefore, call each function in our code. This means we can reuse bits of code easily without having to rewrite each. For the purposes of arduino, these are called `libraries`. You have already downloaded a library for use. This means that, using these statements, we can unlock all of the functions involved with such a file. Remember this for later use.

### Step two:

Now that we know the basics, it is time to write some basic code on your own. This section will walk you through one last example, then ask you to write your own code.

#### Example Code

Before we begin, there is one last thing you should know. There are two basic functions that you must include with each code you write for arduino. `void setup() { }` is called one time at the beginning of the code. This will only run one time, so it is good for doing anything that needs to be done to setup the code. `void loop { }` is called over and over again. This is where you will call the functions that actually does what it is the arduino code should do. Remember, both of these functions must be included with each code or the code will give errors when compiled!!

###### Note

We don't need any preprocessor statements as everything we are doing can be done without extra bits of code. Don't worry about the fact that none are included here.

```C++
int cleanTheRoom(int roomNumber) {
  Serial.print("Room ");
  Serial.print(roomNumber);
  Serial.println("is clean!");
  return 1;
}

void setup() {
  /* This is another way to write comments! This method
   * will allow for comments that span more than one line!
   * Serial.begin(9600); is required before we can print to the serial monitor, but
   * don't worry about why this works for now.
   */
  Serial.begin(9600);
  Serial.println("The room is dirty!");
}

void loop() {
  int room = 1;
  cleanTheRoom(room);
  delay(5000);
  Serial.println("The room is dirty again!");
  delay(5000);
}
```

Try changing values in the functions to see how each reacts. This is a very simple code, but such simplicity is all that you need to create something larger. Some questions to answer are: what does `delay(int time)` do? What is the difference between `Serial.print()` and `Serial.println()`? Where is the first time cleanTheRoom() is called? How many times does void loop() run?

---

##### Answers
1. This function waits for a set amount of time in milliseconds. Therefore, waiting for 1 second is `delay(1000);` in arduino.
2. `Serial.print()` prints something on a single line. `Serial.prinln()` makes the next thing printed go to a new line.
3. `cleanTheRoom()` is first called in `void loop()`
4. `void loop()` runs an infinite amount of times. *Or for however long the arduino is on.*

The output from this code would have been:
```
The room is dirty!
Room 1 is clean!
The room is dirty again!
Room 1 is clean!
The room is dirty again!
Room 1 is clean!
```

This would have continued forever, or as long as the arduino were plugged in.

So, hopefully you have a grasp of variables, functions, and preprocessor statements along with a general grasp of arduino. Now is the time for your first challenge!

#### Code it yourself

We need you to make a code that outputs the following:
```
Hello World!
I am cleaning room 1!
Room 1 is clean!
The room is dirty!
I am cleaning room 1!
Room 1 is clean!
The room is dirty!
```

Keep in mind, everything but the first line must repeat. Use `Serial.begin(9600);`, `Serial.print()`, and `Serial.println()` to create these outputs. Don't forget `void setup()` and `void loop()` and when they run. Also, don't forget to include `;` at the end of the correct statments. Example code is below that demonstrates this, but try to do it on your own first! One last note: try to have the code wait 6 seconds after printing each line!

After writing the code, hit ![Upload](images/Upload.png) to upload the code to the arduino. Then, hit ![Serial Monitor](images/SerialMon.png) to see what the code outputs.

---

##### Example code

```C++
int cleanTheRoom(int roomNumber) {
  Serial.print("I am cleaning room ");
  Serial.print(roomNumber);
  Serial.print(" !");
  delay(6000);
  Serial.print("Room ");
  Serial.print(roomNumber);
  Serial.println(" is clean!");
}

void setup() {
  Serial.begin(9600);
  Serial.println("Hello World!");
}

void main() {
  int room = 1;
  Serial.println("The room is dirty!");
  delay(6000);
  cleanTheRoom(room);
  delay(6000);

}
```

If your code doesn't look exactly like this but outputs what it should, that's perfectly fine. There is never just one way to make code do something, so having a solution that is different from the example above is perfectly acceptable. If your code doesn't output what you thought it would, continue editing and trying again. Looking back through code to find errors is what coding is all about.

At this point, you have the basics of coding down. Next, we will move on to some special things the code can do in order to set up our weather station.
