#include "DHT.h"

DHT dhtSensor(7, DHT22);

void setup() {
  dhtSensor.begin();
  Serial.begin(9600);
  Serial.println("Starting weather station!");
}

void loop() {
  float temperature;
  float humidity;
  temperature = dhtSensor.readTemperature();
  humidity = dhtSensor.readHumidity();
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  delay(5000);
}
