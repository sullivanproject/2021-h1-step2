import 'dart:io';

class Items {
  late List<Item> items;

  Items() {
    print("Hello");
    var item = Item();
    item.title = "시험기간";
    item.targetDate = "D-120";
    items = [item, item];
  }

  Items.fromJson(Map<String, List<Item>> json) : items = json['items']!;

  Map<String, List<Item>> toJson() => {'items': items};
}

class Item {
  late String title;
  late String targetDate;
  late File image;

  Item();

  Item.fromJson(Map<String, dynamic> json)
      : title = json['title'],
        targetDate = json['targetDate'],
        image = File(json['image']);

  Map<String, dynamic> toJson() => {
        'title': title,
        'targetDate': targetDate,
        'image': image.path,
      };
}
