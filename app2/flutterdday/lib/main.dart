import 'package:flutter/material.dart';
import 'package:flutterdday/SharedPref.dart';
import 'package:flutterdday/mainRoute.dart';

void main() {
  runApp(MaterialApp(
    title: '디데이',
    home: MainRoute(),
  ));
}

SharedPref sharedPref = SharedPref();
