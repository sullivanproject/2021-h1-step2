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
  {//Pirates of the Caribbean OST - He's a Pirate
    a4, 8, c5, 8, d5, 8, 0, 8, d5, 8, 0, 8, d5, 8, e5, 8, f5, 8, 0, 8, f5, 8, 0, 8,
    f5, 8, g5, 8, e5, 8, 0, 8, e5, 8, 0, 8, d5, 8, c5, 8, c5, 8, d5, 8, 0, 4,
    a4, 8, c5, 8, d5, 8, 0, 8, d5, 8, 0, 8, d5, 8, e5, 8, f5, 8, 0, 8, f5, 8, 0, 8,
    f5, 8, g5, 8, e5, 8, 0, 8, e5, 8, 0, 8, d5, 8, c5, 8, d5, 8, 0, 4,
    a4, 8, c5, 8, d5, 8, 0, 8, d5, 8, 0, 8, d5, 8, f5, 8, g5, 8, 0, 8, g5, 8, 0, 8,
    g5, 8, a5, 8, as5, 8, 0, 8, as5, 8, 0, 8, a5, 8, g5, 8, a5, 8, d5, 8, 0, 4,
    d5, 8, e5, 8, f5, 8, 0, 8, f5, 8, 0, 8, g5, 8, 0, 8, a5, 8, d5, 8, 0, 4,
    d5, 8, f5, 8, e5, 8, 0, 8, e5, 8, 0, 8, f5, 8, d5, 8, e5, 8, 0, 4
  },
  {//귀멸의 칼날 OST - 카마도 탄지로의 노래
    f5, 8, e5, 8, f5, 2.7, a5, 2.7, e5, 2, d5, 8, c5, 8, d5, 2.7, f5, 2.7, a5, 2,
    as5, 8, a5, 8, as5, 2.7, d6, 2.7, a5, 2, g5, 8, f5, 8, g5, 2.7, d5, 2.7, a5, 2,
    f5, 8, e5, 8, f5, 2.7, a5, 2.7, e5, 2, d5, 8, c5, 8, d5, 2.7, f5, 2.7, a5, 2,
    as5, 8, a5, 8, as5, 2.7, d6, 2.7, a5, 2, g5, 8, f5, 8, g5, 2.7, d5, 2.7, a5, 1.3
  },
  {//핑크퐁 - 상어가족
    d4, 4, e4, 4, g4, 8, g4, 8, g4, 8, g4, 16, g4, 16, g4, 16, g4, 16, g4, 8,
    d4, 8, e4, 8, g4, 4, g4, 8, g4, 16, g4, 16, g4, 16, g4, 16, g4, 8,
    d4, 8, e4, 8, g4, 4, g4, 8, g4, 16, g4, 16, g4, 16, g4, 16, g4, 8,
    g4, 8, g4, 8, fs4, 8, fs4, 8, 0, 4
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
