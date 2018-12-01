/* These are pre-processor statements. They allow us to add
 * lots of lines of code to the beginning of our own code rather
 * than adding it all in on our own. This code is contained in
 * "header" files. Basically, header files contain code that is
 * often called by more than one sketch. Therefore, it is easier
 * to add one line to the code than rewriting all of the header
 * file into our sketch
 */
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"


/* These are #define statements. They will allow the user to
 * create some name with a value. For instance, when "DHT_PIN"
 * is put into a line of code, the value 7 will be put in its
 * place. This stops the user from having to put the number 7
 * in every time this value is needed. Also, it does not require
 * a variable declaration, which makes it easier.
 */
#define DHT_PIN 7
#define WIND_SENSOR_PIN A0
#define DHT_TYPE DHT22
#define BACKLIGHT_PIN 13

/* These lines will initialize certain things by calling code
 * in the header files. Essentially, we are telling the code
 * "we have a DHT22 based sensor on pin 7". Using this information,
 * the software can now talk to the sensor. These lines make
 * our individual parts available for use.
 */
DHT dhtSensor(DHT_PIN, DHT_TYPE);
LiquidCrystal_I2C lcd(0x27, 20, 4);

/* This is a variable declaration. This will allow us to call
 * this number in the code without us having to type this number
 * more than once.
 */
float voltageConversionConstant = 0.004882814;

/* These are functions. They allow us to tell the computer what to
 * do. They follow this basic structure. They can be called from
 * inside the program, meaning we can write a function once and
 * use it multiple times. This strategy is often used to make
 * the "main" function (the code that the computer starts running)
 * very simple. In this case, the code that makes the sensors read
 * the values will be placed here to make the code inside "loop"
 * very simple. The first word is what the function returns. In other
 * words, the function will run and will spit something out. In the
 * case of these functions, a "float" will come from the function.
 * A "float" is a number with a decimal point (like 1.12345). The
 * second part is the name. This is what you would like the function
 * to be referred to. The "()" will not be used here, and is slightly
 * more advanced, so it will be left out for now. Finally, a "{ }"
 * is used. This is where the code the function will run will go.
 */
 float temperatureRead() {
  float temperature = dhtSensor.readTemperature();
  return temperature;
 }

 float humidityRead() {
  float humidity = dhtSensor.readHumidity();
  return humidity;
 }

/* windRead() is a complicated function. Don't worry too much
 * about how this works quite yet.
 */
float windRead() {
  int analogValue = analogRead(WIND_SENSOR_PIN);
  float voltage = analogValue * voltageConversionConstant;
  float windSpeed = (voltage - 0.4) *32.4/(2 - 0.4);
  if(windSpeed < 0) {
    return 0;
  }else{
    return windSpeed;
  }
}

void lcdWrite(char dataType[4], float dataValue) {
  if(dataType == "tem"){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Temperature:");
    lcd.setCursor(0,1);
    lcd.print(dataValue);
    lcd.print (" *C");
  }else if(dataType == "hum"){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Humidity:");
    lcd.setCursor(0,1);
    lcd.print(dataValue);
    lcd.print (" %");
  }else{
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Wind Speed:");
    lcd.setCursor(0,1);
    lcd.print(dataValue);
    lcd.print (" km/hr");
  }
}

/* The setup() function is where the user can setup everything for
 * the code. This function runs only one time. Keep in mind, none
 * of the above functions ran before this point! Use setup() and
 * later, loop() to call the functions above to make the code run!
 */
void setup() {
  //This line
  dhtSensor.begin();
  //Initialize the LCD
  lcd.init();
  lcd.backlight();
  //Set where the LCD is to print. (0,0) is the top left corner.
  lcd.setCursor(0,0);
  //Print 'Initializing' to the LCD
  lcd.print("Initializing");
  delay(5000);
  //Clear the LCD
  lcd.clear();
}

/* The loop() function is where the user can define a set of code
 * that will be run continuously. This code will loop, as the name
 * suggests, so this is where the sensors will actually read data
 * and where the LCD will be set to display the results. Keep in
 * mind, both loop() and setup() need to be 'void'!
 */
void loop() {
  char dataType[4];
  float temperature = temperatureRead();
  float humidity = humidityRead();
  float wind = windRead();
  lcdWrite("Tem", temperature);
  delay(5000);
  lcdWrite("Hum", humidity);
  delay(5000);
  lcdWrite("Win", wind);
  delay(5000);
}
