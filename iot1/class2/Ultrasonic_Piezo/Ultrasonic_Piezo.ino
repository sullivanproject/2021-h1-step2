int TrigPin = 7;
int EchoPin = 6;
int BuzzerPin = 2;

void setup()
{
  pinMode(TrigPin, OUTPUT);
  pinMode(EchoPin, INPUT);
  pinMode(BuzzerPin, OUTPUT);
}

void loop()
{
  //초음파 송신
  digitalWrite(TrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(TrigPin, LOW);

  //초음파 수신
  float duration = pulseIn(EchoPin, HIGH);

  //거리를 cm로 변환
  float distance = 340*duration / 10000 / 2;

  //거리에 따른 경고음 출력
  if(distance >= 100 && distance < 200){
    tone(BuzzerPin, 392, 300);
    delay(1200);
  }else if(distance >= 50 && distance < 100){
    tone(BuzzerPin, 392, 300);
    delay(800);
  }else if(distance < 50){
    tone(BuzzerPin, 392, 300);
    delay(500);
  }else
    noTone(BuzzerPin);
}
