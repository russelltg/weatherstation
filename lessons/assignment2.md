# Assignment 2

Below is a snippet of code. However, this code is broken. You have the task of looking at the code and determining why it does not work. Then, you must fix the code so that it operates as it should. Use your knowledge gained from lessons 1-5 to help you with this task.

```C++
include DHT.H

DHT dhtSensor(7, DHT22);

int setup() {
  dhtSensor.begin
  Serial.begin(9600);
  Serial.print("Starting weather station!")
}

void loop() {
  float temperature
  float humidity
  temperature = dhtSensor.readTemperature()
  hum = dhtSensor.readTemperature();
  Serial.println("Temperature:")
  Serial.print(temperature);
  Serial.println("Humidity: ")
  Serial.print(humidity);
  delay(5 seconds)
}
```

> ***WARNING: This code is very, very broken. Don't assume that anything in it works as it should***

Good luck!
