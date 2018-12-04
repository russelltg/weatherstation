#include "DHT.h"

DHT dhtSensor(7, DHT22);

void setup() {
  Serial.begin(9600);
  dhtSensor.begin();
  delay(500);
}

void loop() {
  float temperature;
  float humidity;
  temperature = dhtSensor.readTemperature();
  humidity = dhtSensor.readHumidity();

  //This set of if statements will make the temperature
  //"HOT" when the temperature is greater than 25 *C
  //"COLD" when the tempearture is below 15 *C
  //"Neither" when the temperature is from 15-25 *C

  if(temperature > 25) {
    Serial.println("It is HOT");
  } else if(temperature < 15) {
    Serial.println("It is COLD");
  } else {
    Serial.println("It is neither HOT nor COLD");
  }

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");

  delay(5000);
}
