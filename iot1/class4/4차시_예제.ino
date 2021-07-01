// 스위치가 on일 경우에만 가변저항에 따라 서보모터가 움직임
//
#include <Servo.h>
Servo myServo;
void setup()
{
  Serial.begin(9600);					//시리얼 통신 초기화
  myServo.attach(9);					//디지털9번핀을 서보모터에 사용
  pinMode(7,INPUT);
}

void loop()
{
  int readValue_switch = digitalRead(7);
  if (readValue_switch ==HIGH){
  float readValue = analogRead(A0);  		//아날로그 신호 측정		
  float angle = (readValue * 180) /1023 ;	//각도 조절
  Serial.println(readValue);
  Serial.println(angle);
  myServo.write(angle);
  delay(100);
  }
  
}