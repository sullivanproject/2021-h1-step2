#ifndef Melody_CPP
#define Melody_CPP

#include "Arduino.h"
#include "Melody.h"

float songs[][200]={
  {//HarryPotter OST - Hedwig's Theme
    b4, 4, e5, 2.7, g5, 8, fs5, 4, e5, 2, b5, 4, a5, 1.3, fs5, 1.3,
    e5, 2.7, g5, 8, fs5, 4, ds5, 2, fs5, 4, b4, 1.3,
    e5, 2.7, g5, 8, fs5, 4, e5, 2, b5, 4, d6, 2, cs6, 4, c6, 2, gs5, 4,
    c6, 2, b5, 4, as5, 4, as4, 2, g5, 4, e5, 1.3, g5, 4,
    b5, 2, g5, 4, b5, 2, g5, 4, c6, 2, b5, 4, as5, 2, fs5, 4,
    g5, 2.7, b5, 8, as5, 4, as4, 2, b4, 4, b5, 1.3, g5, 4,
    b5, 2, g5, 4, b5, 2, g5, 4, d6, 2, cs6, 4, c6, 2, gs5, 4,
    c6, 2.7, b5, 8, as5, 4, as4, 2, g5, 4, e5, 1.3
  },
  {//도레미파솔라시도
    c4, 4, d4, 4, e4, 4, f4, 4, g4, 4, a4, 4, b4, 4, c5, 4
  }};

void play(int Pin, int num){
  int notes = sizeof(songs[0])/sizeof(songs[0][0]);

  for (int i = 1; i < notes;){
    int durations = 1000 / songs[num][i];

    tone(Pin, songs[num][i-1], durations);
    delay(durations*1.5);
    i = i+2;
  }
  noTone(Pin);
}

#endif