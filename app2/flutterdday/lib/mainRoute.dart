import 'package:flutter/material.dart';
import 'package:flutterdday/colorSet.dart';
import 'package:flutterdday/item.dart';
import 'package:flutterdday/main.dart';
import 'package:flutterdday/makeRoute.dart';

class _MainRouteState extends State<MainRoute> {
  Items items = Items();

  _getListData(BuildContext context) {
    List<Widget> widgets = [];
    for (int i = 0; i < items!.items.length; i++) {
      widgets.add(_ddayWidget(context, items!.items[i]));
    }
    return widgets;
  }

  loadSharedPrefs() async {
    try {
      setState(() async {
        items = Items.fromJson(await sharedPref.read("items"));
      });
    } catch (Excepetion) {}
  }

  Widget build(BuildContext context) {
    // loadSharedPrefs();
    return Scaffold(
        backgroundColor: ColorExt.background,
        appBar: AppBar(
          title: Text('디데이'),
          backgroundColor: ColorExt.black,
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MakeRoute()),
                ).then((value) => loadSharedPrefs());
              },
            )
          ],
        ),
        body: _mainWidget(context));
  }

  Widget _mainWidget(BuildContext context) {
    print(items.items.length);
    if (items.items.isNotEmpty) {
      return ListView(children: _getListData(context));
    }
    return _emtpyWidget();
  }

  Widget _emtpyWidget() {
    return Center(
        child: Text('등록된 디데이가 없습니다\n디데이를 추가해주세요',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: ColorExt.dimedText,
                fontWeight: FontWeight.w200,
                fontSize: 20)));
  }

  Widget _ddayWidget(BuildContext context, Item item) {
    return Padding(
        padding: EdgeInsets.fromLTRB(20, 10, 20, 10),
        child: Container(
            width: double.infinity,
            height: (MediaQuery.of(context).size.width - 40) / 335 * 170,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: ColorExt.line),
              image: DecorationImage(
                image: AssetImage("assets/images/DummyImage1.png"),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          ColorExt.gradationStart,
                          ColorExt.gradationEnd,
                        ])),
                child: Padding(
                    padding: EdgeInsets.fromLTRB(12, 0, 12, 12),
                    child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            item.title,
                            style: TextStyle(
                                color: ColorExt.text,
                                fontSize: 20,
                                fontWeight: FontWeight.bold),
                          ),
                          Text(item.targetDate,
                              style: TextStyle(
                                  color: ColorExt.text,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold))
                        ])))));
  }
}

class MainRoute extends StatefulWidget {
  @override
  _MainRouteState createState() => _MainRouteState();
}
