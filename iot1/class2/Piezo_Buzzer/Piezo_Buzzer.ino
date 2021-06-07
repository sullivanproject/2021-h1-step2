#include <Melody.h>

int BuzzerPin = 2;

void setup()
{
  pinMode(BuzzerPin, OUTPUT);
}

void loop()
{
  //도레미파솔라시도 출력
  play(BuzzerPin, 1);
  
  //HarryPotter OST - Hedwig'd Theme 출력
  play(BuzzerPin, 0);
}
