# Lesson 3: Learning the basics of coding [~30 minutes]
This lesson will teach the basics of coding. It will cover functions, variables, and general operating lines of code and how to use each.

By the end of this tutorial, you will be able to read code and understand the basic functions, as well as write some of your own code.

Let's get started!

### Step one

In order to set up a simple weather station, we must first know the basics of coding. This tutorial will show you these basics. From there, you will work on a challenge to show mastery over these basic topics.

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
