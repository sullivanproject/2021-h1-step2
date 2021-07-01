#include <Servo.h>

#define echoPin 11
#define trigPin 12
#define servoPin 9

#define ledPin1 6
#define ledPin2 7
#define BuzzerPin 3

Servo servo;

void setup() {
  Serial.begin(9600);
  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);

  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(BuzzerPin, OUTPUT);

  digitalWrite(ledPin1, HIGH);
  digitalWrite(ledPin2, LOW);
  servo.attach(servoPin);
}

void loop() {
  if(get_distance() < 10){
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, HIGH);
    
    for(int angle = 0 ; angle<90 ; angle++){
      servo.write(angle);
      delay(50);
    }

    tone(8, 330, 100);
    
    for(int angle = 90 ; angle>0 ; angle--){
      servo.write(angle);
      delay(50);
    }
    
    digitalWrite(ledPin1, HIGH);
    digitalWrite(ledPin2, LOW);
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
