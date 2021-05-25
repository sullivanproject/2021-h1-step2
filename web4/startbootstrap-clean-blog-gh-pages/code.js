function doGet(e) {
    Logger.log(e);
    //console.log();
    Logger.log(e.parameter);
    return HtmlService.createTemplateFromFile('index').evaluate();
  }
  
  function writeData(title, content){
    const url = 'https://docs.google.com/spreadsheets/d/1Td8Z6dxYFju11IFnjfA8ryl6iT4O7lm4SEScsszQHmg/edit#gid=0';
    const ss = SpreadsheetApp.openByUrl(url);
    const ws = ss.getSheetByName('data');
  
    //Logger.log(title, content);
    ws.appendRow([contents.title, contents.content, new Date(), contents.section, contents.writer]);
  }
  
  function loadData(){
    const url = 'https://docs.google.com/spreadsheets/d/1Td8Z6dxYFju11IFnjfA8ryl6iT4O7lm4SEScsszQHmg/edit#gid=0';
    const ss = SpreadsheetApp.openByUrl(url);
    const ws = ss.getSheetByName('data');
  
    let data = ws.getRange(1, 1, ws.getLastRow(), 5).getValues();
    console.log(data);
  
    returnData = [];
    for (let index = 0; index < data.length; index++){
        returnData.push(data[index][0], data[index][1], String(data[index][2]), data[index][3], data[index][4]);
    } 

    return returnData;
  }
  
  function include(filename){
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }