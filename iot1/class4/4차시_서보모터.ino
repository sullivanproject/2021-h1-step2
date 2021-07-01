#include <Servo.h>

// C++ code
//

Servo myServo;
void setup()
{
  myServo.attach(9);				//디지털 9번핀을 서보모터 제어에 사용
}

void loop()
{
  for(int angle=0;angle<180;angle++){//서보 모터의 각도 동작
  myServo.write(angle);
    delay(100);
  }
  
}