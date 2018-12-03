//1
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

//2
#define DHT_PIN 7
#define WIND_SENSOR_PIN A0
#define DHT_TYPE DHT22
#define BACKLIGHT_PIN 13

//3
DHT dhtSensor(DHT_PIN, DHT_TYPE);
LiquidCrystal_I2C lcd(0x27, 20, 4);

//4
float voltageConversionConstant = 0.004882814;

//5
 float temperatureRead() {
  float temperature = dhtSensor.readTemperature();
  return temperature;
 }

 float humidityRead() {
  float humidity = dhtSensor.readHumidity();
  return humidity;
 }

//6
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

//This function accepts a string, 'dataType' and floating point number, 'dataValue'
//in order to print the value to the LCD.
void lcdWrite(char dataType[4], float dataValue) {
  if(dataType == "Tem"){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Temperature:");
    lcd.setCursor(0,1);
    lcd.print(dataValue);
    lcd.print (" *C");
  }else if(dataType == "Hum"){
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

//7
void setup() {
  //Initialize the DHT sensor
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

//8
void loop() {
  //Create a string called 'dataType'
  char dataType[4];
  //Create 3 integers
  float temperature = temperatureRead();
  float humidity = humidityRead();
  float wind = windRead();
  //Send two values, 'dataType' and the value to lcdWrite()
  //It will then print that to the LCD
  lcdWrite("Tem", temperature);
  delay(5000);
  lcdWrite("Hum", humidity);
  delay(5000);
  lcdWrite("Win", wind);
  delay(5000);
}
