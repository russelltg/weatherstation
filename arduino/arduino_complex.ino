#include "DHT.h"
#include <SoftwareSerial.h>

//i find that putting them here makes it easier to 
//edit it when trying out new things

#define RX_PIN 3
#define TX_PIN 2
#define ESP_BRATE 9600
#define DHT_PIN 7
#define DHT_TYPE DHT22
#define WIND_SENSOR_PIN A0
 
float voltageConversionConstant = .004882814;

DHT sensor(DHT_PIN, DHT_TYPE);

SoftwareSerial esp8266(RX_PIN, TX_PIN);

// Run an AT command
// command - the AT command, including AT+
// timeout_ms - the timeout of the command, in milliseconds.
//              use -1 for an infinite timeout
// output - a pointer to a string to store the full string output,
//          including the echo part. can be left null.
// 
// return - if it succeeds
bool at_command(String command, int timeout_ms, String* output) {
  esp8266.println(command);

  String ret;

  int start_time = millis();
  while (timeout_ms == -1 || millis() < start_time + timeout_ms) {
    String line = esp8266.readStringUntil('\n');
    if (line == "OK\r") {
      if (output) {
        *output = ret;
      }
      return true;
    }
    if (line == "ERROR\r") {
      if (output) {
        *output = ret;
      }
      return false;
    }

    ret += line;
    ret += '\n';
  }
  if (output) {
    *output = ret;
  }
  return false;
}

void upload_data(String sensor, float reading) {
  // escape " to \" for JSON
  sensor.replace("\"","\\\"");
  String json = "{\"sensor\": \"" + sensor + "\", \"reading\": " + reading + "}\n";
  Serial.println(json.length());

  esp8266.println(String("AT+CIPSEND=0,") + json.length());
  delay(10); // apparently this is important
  esp8266.println(json);

  int start = millis();
  while (millis() < start + 2000) {
    String line = esp8266.readStringUntil('\n');
    Serial.println(line);
    if (line == "ERROR\r") {
      Serial.println("Faield to send data to pi");
      break;
    } 
    if (line == "SEND OK\r") {
      Serial.println("Succeeded in sending data to pi");
      break;
    }
  }
}

float windRead(){
  int analogValue = analogRead(WIND_SENSOR_PIN);
  float voltage = analogValue * voltageConversionConstant;
  float windSpeed = (voltage - 0.4) * 32.4/(2 - 0.4);
  if(windSpeed < 0 ){
    return 0;
  }else{
    return windSpeed;
  }
}

void setup()
{
  Serial.begin(9600);
  while (!Serial) {
    delay(10);
  }
  Serial.println("1");

  sensor.begin();
  Serial.println("Sensor init success!");
  delay(10);
  
  esp8266.begin(ESP_BRATE); // I changed this
  while (!esp8266) {
    delay(10);
  }


  Serial.println("2");

  
  String out;
  bool ret;

  ret = at_command("AT+CWMODE=1", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to setup station mode!");
    return;
  }

  // CWLAP shows a list of the wifi networks that it can see
  ret = at_command("AT+CWLAP", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to show wifi networks!");
    return;
  }


  Serial.println("3");




  // CWJAP connects to a wifi network. Enter the SSID (name) and password
  // for the wifi network here.
  ret = at_command("AT+CWJAP=\"MOORE FAMILY\",\"brightraccoon030\"", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to connect to wifi network!");
    return;
  }

  // Get the status of the network.
  ret = at_command("AT+CIPSTATUS", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to get status");
    return;
  }
  // 2 is good to go, anything else is bad.
  if (out.indexOf('2') == -1) {
    Serial.println("Wifi network is not setup correctly");
    //return;
  }

  // get the ip of the arduino
  ret = at_command("AT+CIFSR", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to get IP address of the arduino");
    return;
  }

  // setup the receiver to allow multiple connections at one time, which is
  // required to run a server
  ret = at_command("AT+CIPMUX=1", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to set mux mode for multiple connections");
    return;
  }

  // setup a TCP server for the raspberry pi to connect to
  // 1 means create server
  // 2000 is the port, which is an arbitrary decision that is coded into the pi
  ret = at_command("AT+CIPSERVER=1,2000", -1, &out);
  Serial.println(out);
  if (!ret) {
    Serial.println("Failed to setup the arduino as a TCP server on port 2000");
  }

  // wifi is now setup and good to 

  
}



void loop()
{ 
    float temp = sensor.readTemperature();
    float hum = sensor.readHumidity();
    float wind = windRead();
    upload_data("temp", temp);
    delay(10);
    upload_data("humidity", hum);
    delay(10);
    upload_data("wind", wind);
    Serial.println(temp);
    Serial.println(hum);
    Serial.println(wind);
    delay(5000);
}
