# Assignment 3

For this assignment, you must write your own weather station. However, this weather station has a twist. Rather than telling the person looking at the LCD what the temperature is, you must tell them whether it is hot, cold, or just right. You can make the decision as to what temperatures fall into each range, but it cannot display a value. The humidity can just be displayed as a value, but temperature cannot.

To do this, you must use the if command:

```C++
void setup() {
  Serial.begin(9600);
  int value = 1;
  if(value == 1) {
    Serial.println("The value is 1!");
  } else {
    Serial.println("The value is not 1!");
  }

  if(value > 10) {
    Serial.println("The value is greater than 10!");
  } else {
    Serial.println("The value is less than 10!");
  }

  if(value <= 100) {
    Serial.println("The value is less than or equal to 100!");
  } else {
    Serial.println("The value is not less than or equal to 100!");
  }
}
```

This code would output this:

```
The value is 1!
The value is less than 10!
The value is less than or equal to 10!
```

Good luck!
