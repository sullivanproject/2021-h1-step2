import 'dart:async';

import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // controller  for move the map in application
  GoogleMapController _controller;

  // this value is first  position when map is start.
  final CameraPosition _initialPosition = CameraPosition( //초기좌표
    target: LatLng(37.498095, 127.027610), //사용자 지정 좌표
    zoom: 14, //확대
  );

  // Marker list for  places to be marked when clicking on the map
  final List<Marker> markers = [];

  addMarker(cordinate) { //마커 추가
    int id = Random().nextInt(100);

    setState(() {
      markers
          .add(Marker(position: cordinate, markerId: MarkerId(id.toString()), infoWindow: InfoWindow(
        title: 'Marker',
        snippet: 'my route 1',
      ),));
    });
  }
  MapType _currentMapType = MapType.normal;

  void _onMapTypeButtonPressed() {
    setState(() {
      _currentMapType = _currentMapType == MapType.normal
          ? MapType.satellite
          : MapType.normal;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar( //앱바
          title: Text("My Trip Map App"),
        ),
        body: Stack(
          children: <Widget>[
            GoogleMap(
              initialCameraPosition: _initialPosition,
              mapType: MapType.normal, //맵 타입 지정
              onMapCreated: (controller) {
                setState(() {
                  _controller = controller;
                });
              },
              markers: markers.toSet(),

              //the clicked position will be centered and marked
              onTap: (cordinate) {
                _controller.animateCamera(CameraUpdate.newLatLng(cordinate));
                addMarker(cordinate);
              },
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Align(
                alignment: Alignment.topRight,
                child: Column(
                  children: <Widget> [
                    FloatingActionButton(
                      onPressed: _onMapTypeButtonPressed,
                      materialTapTargetSize: MaterialTapTargetSize.padded,
                      backgroundColor: Colors.blue,
                      child: const Icon(Icons.map, size: 36.0),
                    ),
                    SizedBox(height: 16.0),
                  ],
                ),
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton( //버튼 누르면 줌 아웃
          onPressed: () {
            _controller.animateCamera(CameraUpdate.zoomOut());
          },
          child: Icon(Icons.zoom_out),
        ));
  }
}