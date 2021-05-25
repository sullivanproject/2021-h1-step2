import 'package:flutter/material.dart';
import 'package:flutterdday/colorSet.dart';
import 'package:flutterdday/item.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart';
import 'package:flutterdday/main.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class _MakeRouteState extends State<MakeRoute> {
  File? _image;
  final titleController = TextEditingController();
  final dateController = TextEditingController();

  getGalleryImage() async {
    var image = await ImagePicker().getImage(source: ImageSource.gallery);
    Directory tempDir = await getApplicationDocumentsDirectory();
    String path = tempDir.path;
    var fileName = basename(image!.path);
    File localImage = await File(image.path).copy('$path/$fileName');
    setState(() {
      _image = localImage;
    });
  }

  saveItem(BuildContext context) async {
    late Items items;
    try {
      Items.fromJson(await sharedPref.read("items"));
    } catch (Excepetion) {
      items = Items();
    }
    var item = Item();
    item.title = titleController.text;
    item.targetDate = dateController.text;
    item.image = _image!;
    items.items.add(item);
    sharedPref.save("items", items);
    Navigator.pop(context);
  }

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorExt.background,
      appBar: AppBar(
        title: Text('생성하기'),
        backgroundColor: ColorExt.black,
        actions: <Widget>[
          new TextButton(
            child: Text("완료", style: TextStyle(fontSize: 17)),
            onPressed: () {
              saveItem(context);
            },
          )
        ],
      ),
      body: _makeDdayWidget(context),
    );
  }

  Widget _makeDdayWidget(BuildContext context) {
    return Column(children: [
      _customImageButton(context),
      _customDdayTextField('제목'),
      _customDdayTextField('날짜')
    ]);
  }

  Widget _customDdayTextField(String title) {
    return Padding(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
        child: TextField(
            style: TextStyle(
                color: ColorExt.white,
                fontSize: 24,
                fontWeight: FontWeight.w200),
            decoration: InputDecoration(
              labelText: title,
              labelStyle: TextStyle(color: ColorExt.dimedText),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: ColorExt.line),
              ),
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: ColorExt.white),
              ),
            )));
  }

  Widget _customImageButton(BuildContext context) {
    return Container(
        width: double.infinity,
        height: (MediaQuery.of(context).size.width - 40) / 335 * 170,
        child: FlatButton(
            onPressed: () {
              getGalleryImage();
            },
            color: ColorExt.SecondaryBackgroundColor,
            child: _image != null
                ? Image.file(_image!, fit: BoxFit.cover, width: double.infinity)
                : Icon(
                    Icons.photo_album,
                    color: ColorExt.dimedText,
                  )));
  }
}

class MakeRoute extends StatefulWidget {
  @override
  _MakeRouteState createState() => _MakeRouteState();
}
