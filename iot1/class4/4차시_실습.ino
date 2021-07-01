// 4차시 실습과제
//mode1 : 스위치 입력이 HIGH이면 가변저항에 따라 서보모터의 각도를 움직인다.
//mode2 : 스위치 입력이 LOW이면 서보모터는 0도부터 180도까지 증가했다가 0도로 다시 감소한다.
//			서보모터의 각도가 45도의 배수가 되면 부저음이 울리고, LED가 깜박인다. (45도는 1번, 90도는 2번...)

#include <Servo.h>

Servo myServo;
float angle = 0;
void setup()
{
  Serial.begin(9600);					//시리얼 통신 초기화
  pinMode(7,INPUT);						//슬라이드스위치 input으로 설정
  pinMode(8,OUTPUT);					//피에조 부저 output으로 설정
  pinMode(13,OUTPUT);					//LED output으로 설정
  myServo.attach(9);					//디지털9번핀을 서보모터에 사용
  
}

void control()
{
  if ((int)angle%45==0){
    for(int i=0; i<angle/45;i++){
    	digitalWrite(13,HIGH);
      	digitalWrite(13,LOW);
       	tone(8,330,100);
      delay(500);
    }
  }
}

void loop()
{
  float readValue = analogRead(A0);  		//아날로그 신호 측정
  int readValue_switch = digitalRead(7);	//스위치 신호 측정
  
  if (readValue_switch == HIGH){			//mode1
    angle = (readValue * 180) /1023 ;	//가변저항에 따라 각도 조절
  	Serial.println(angle);
  	myServo.write(angle);
  	delay(50);
  }
  else if (readValue_switch == LOW){		//mode2
    for(angle=0; angle<180; angle++){	//각도 증가
      myServo.write(angle);
      control();
      delay(50);
    }
    for(angle = 180; angle>0; angle--){//각도 감소
      myServo.write(angle);
      control();
      delay(50);
    }
  }
  
}