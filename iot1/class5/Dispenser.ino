#include <Servo.h>

#define echoPin 11
#define trigPin 12
#define servoPin 9

Servo servo;

void setup() {
  Serial.begin(9600);
  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);

  servo.attach(servoPin);
}

void loop() {
  if(get_distance() < 10){
    for(int angle = 0 ; angle<90 ; angle++){
      servo.write(angle);
      delay(50);
    }
    
    for(int angle = 90 ; angle>0 ; angle--){
      servo.write(angle);
      delay(50);
    }
  }
}

float get_distance(){
  digitalWrite(trigPin, HIGH);
  delay(10);
  digitalWrite(trigPin, LOW);

  float duration = pulseIn(echoPin, HIGH);
  float distance = ((float)(340 * duration) / 10000) / 2;

  return distance;
}
