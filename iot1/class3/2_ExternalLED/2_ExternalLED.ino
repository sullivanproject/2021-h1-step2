int LED_pin = 8;
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_pin, OUTPUT);
}

void loop() {
  digitalWrite(LED_pin, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_pin, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
