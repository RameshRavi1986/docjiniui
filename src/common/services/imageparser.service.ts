import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class ImageParseDataService {
 formResult: any = {};
 scannedTxt: any ="";
constructor(private http: HttpClient ){
}
  static coordsList = [];

  static lines = [];

 static rules = {
    total: {
      options: [
        {
          text: "total",

          regex: "\btotal\b",

          priority: 1
        },

        {
          text: "subtotal",

          regex: "\bsubtotal\b",

          priority: 2
        },

        {
          text: "amt",

          regex: "\bamt\b",

          priority: 3
        }
      ],

      valueRegex: "[0-9]+\.[0-9]*",

      name: "totalAmount"
    },

    cardDetails: {
      valueRegex: "([*]{8})([0-9]{4})",
      name: "cardNumber"
    },
    currency: {
	valueRegex: ["(gbp|aud)" ,"[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]"],
	name: "currency"
    },

    date: {
      name: "date",
      valueRegex: ["(\\d{1,2})\/(\\d{1,2})\/(\\d{2,4})","^(([0-9])|([0-2][0-9])|([3][0-1]))(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\\d{2,4}$","^(([0-9])|([0-2][0-9])|([3][0-1]))(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\'\\d{2,4}$"]
    }
  };

  checkForCoordMatch(obj, des) {
    var len = ImageParseDataService.coordsList.length;

    var matchlineFound = false;

    var index = 0;

    for (var i = 0; i < len; i++) {
      if (
        obj.t >= ImageParseDataService.coordsList[i].t &&
        obj.b <= ImageParseDataService.coordsList[i].b
      ) {
        ImageParseDataService.lines[ImageParseDataService.coordsList[i].t] =
          ImageParseDataService.lines[ImageParseDataService.coordsList[i].t] +
          " " +
          des;

        matchlineFound = true;

        index = i;
      }
    }

    if (!matchlineFound) {
      ImageParseDataService.coordsList.push({ t: obj.t - 4, b: obj.b + 4 });

      ImageParseDataService.lines[obj.t - 4] = des;
    }
  }

  parseData(data) {

    alert("inside data");
    this.formResult={};
     this.scannedTxt = data.responses[0].fullTextAnnotation.text;
    this.scannedTxt = this.scannedTxt.toLowerCase();
    ImageParseDataService.lines = this.scannedTxt.split("\n");
    this.extractTotalPrice();
    //console.log(extractedTotalPrice);
    alert("before process rules");
    this.processRules(this.scannedTxt);
    alert("after process rules");
    return this.formResult; 
  }

  extractTotalPrice(){
    var totalPrice = this.scannedTxt.match(/[0-9]+\.[0-9]+/g);
    var extractedTotalPrice = this.sortDescending(totalPrice);
  }
  sortDescending(list){
        if(list && list.length > 0){
	alert("lsitlength");
	alert(list.length);
	var sortedList = list.sort(function(a, b){return b-a});
	this.getTotalPrice(sortedList);
	if(!this.formResult.total){
		this.formResult.total =sortedList[0];
	}
	return sortedList;
	}
  }

  getTotalPrice(sortedList){
    alert(sortedList[0]);
    for(let i=0; i< 6; i++){
    if(!isNaN(sortedList[i])){
	var regexNumber = new RegExp(sortedList[i],'g');
	var occuringList = this.scannedTxt.match(regexNumber);
	if(occuringList && occuringList.length >1){
	        alert(this.formResult.total);
		this.formResult.total = sortedList[i];
		break;
	}
    }
    }
  }

  processRules(data) {
    var keys = Object.keys(ImageParseDataService.rules);
    alert(keys.length);
    for (var i = 0; i < keys.length; i++) {
    alert(ImageParseDataService.rules[keys[i]].valueRegex);
      if (ImageParseDataService.rules[keys[i]].options) {
        // this.applyRules(ImageParseDataService.rules[keys[i]], data);
      } else if (ImageParseDataService.rules[keys[i]].valueRegex) {
        var rege = ImageParseDataService.rules[keys[i]].valueRegex;
	let regeArray;
        if(rege && rege instanceof Array){
	regeArray =rege;
	}
	else{
	 regeArray = [rege];
	}
   for(let j=0;j<regeArray.length; j++){
	alert("regex");
        alert(new RegExp(regeArray[j],'g'));
        let result = data.match(new RegExp(regeArray[j],'g'));
        alert(result);
        if (result) {
          this.formResult[
            ImageParseDataService.rules[keys[i]].name
          ] = result[result.length - 1];
        }
	}
      }
    }
  }

  applyRules(rule, data) {
    var options = rule.options;

    var selectedRule = { priority: 1000 };

    for (var i = 0; i < options.length; i++) {
      if (
        selectedRule.priority &&
        selectedRule.priority > options[i].priority
      ) {
        var matchFound = this.getResult(rule, options[i]);

        if (matchFound) {
          selectedRule = options[i];
        }
      }
    }
  }

  getResult(rule, selectedRule) {
    var matchFound = false;

    for (var j = 0; j < ImageParseDataService.lines.length; j++) {
      var rege = new RegExp(selectedRule.regex);

      var executedResult = ImageParseDataService.lines[j].match(rege);

      if (executedResult) {
        var erg = new RegExp(rule.valueRegex,'g');

        var finalOutput =
          ImageParseDataService.lines[j + 1] &&
          ImageParseDataService.lines[j + 1].match(erg);

        if (finalOutput && finalOutput.length > 0) {
          this.formResult[rule.name] =
            finalOutput[finalOutput.length - 1];
        }
      }
    }

    return matchFound;
  }

  parseImage(img) {
    var reqs = {
      requests: [
        {
          features: [
            {
              type: "TEXT_DETECTION"
            }
          ],

          image: {
            content: img
          }
        }
      ]
    };

   return this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB-YzJYxWrHEkEAcpJhPCgpyXsda5P6mhs&alt=json", JSON.stringify(reqs));
   /* $.ajax({
      url:
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB-YzJYxWrHEkEAcpJhPCgpyXsda5P6mhs&alt=json",

      type: "post",

      method: "POST",

      contentType: "application/json",

      data: JSON.stringify(reqs),

      processData: false,

      success: function(data) {
        this.processData(data);
      }
    }); */

    /*$.post( "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB-YzJYxWrHEkEAcpJhPCgpyXsda5P6mhs&alt=json", reqs)

         .done(function( data ) {

         alert( "Data Loaded: " + data );

         });*/

    /* var img = new Image ();

        img.src = "tesco1.jpeg";

        img.onload = function () {



            Tesseract.recognize (img)

                .then (function (result) {

                    console.log (result)

                });

        }*/
  }
}
