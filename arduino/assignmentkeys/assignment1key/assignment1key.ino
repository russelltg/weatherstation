void setup() {
  Serial.begin(9600);
  Serial.println("Hello World!");
  delay(3000);
  Serial.println("This is arduino code");
  delay(3000);
  Serial.println("It is currently printing to the serial monitor");
  delay(3000);
}
 void loop() {
   Serial.println("This is a looped message");
   delay(3000);
 }
