#include <DHT.h>

DHT dhtSensor(7, DHT22);

void setup() {
    Serial.begin(9600);
    dhtSensor.begin();
}

void loop() {
    float temp = dhtSensor.readTemperature();
    Serial.println(temp);
    delay(1000);
}
