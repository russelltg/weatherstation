# Lesson 4: Weather station functions [~30 minutes]

In our code, we can do a lot more than printing an output. Generally, when we want our code to do something, we find a library that can do what we want, we add the header file using a `#`, and we use the functions we want inside the code to achieve the final result.

This tutorial will walk you through this process allowing you to use any functions you can think of. This means you will, in theory, be able to do whatever you want with the code.

Let's get started!

### Step one:

First, we need to find a library to use that includes the functions we want. You already did this process in lesson 2, but we will review it here. Going to `Tools`->`Manage Libraries...` will allow you to find libraries. From there, you can then search any library you want and install it. You already have the `DHT Sensor Library` that we will need to operate our temperature and humidity sensor for the weather station, but we need to be able to output the results somehow. For this, we will use an LCD panel. The LCD panel needs to be told what to display and how to do it, so we need a library!

But now we have an issue... The library we need cannot be found under `Tools`->`Manage Libraries...`. So how do we install it?

First, go to the website that has the download for the library at https://www.arduinolibraries.info/libraries/liquid-crystal-i2-c. The website will look like this:

![Library Website](images/LibrarySite.png)

Click on the button that says `LiquidCrystal_I2C-1.1.2.zip`. This will download the library to your computer. We then need to add this to the arduino software. To do this, we will go to `Sketch`->`Include Library`->`Add .ZIP Library...`

![Add Library](images/AddLibrary.png)

Then, go to your downloads folder. Double clicking on a folder will allow you to open it. When you finally can see `LiquidCrystal_I2C-1.1.2.zip`, click on it once. Then click open.

![Add .ZIP](images/AddLibraryZIP.png)

Congratulations! You have just added a library from the internet. This process can be repeated to gather any library you need. The possibilities are endless!

### Step two:

Now that we have a library, we need to learn how to use it. This is the portion where you will have to take some time to learn on your own. This part is the main skill of coding. Being able to look at example code and turning it into what you want to do is the most important thing. To begin, click `Files`->`Examples`->`01.Basics`->`Blink`
