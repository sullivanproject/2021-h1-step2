int TrigPin = 7;
int EchoPin = 6;

void setup()
{
  Serial.begin(9600);
  pinMode(TrigPin, OUTPUT);
  pinMode(EchoPin, INPUT);
}

void loop()
{
  //초음파 송신
  digitalWrite(TrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(TrigPin, LOW);

  //초음파 수신
  float duration = pulseIn(EchoPin, HIGH);

  //물체와의 거리를 cm로 변환
  float distance = 340*duration / 10000 / 2;
  
  Serial.print("distance : ");
  Serial.println(distance);
}
