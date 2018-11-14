import { Component } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: "receipt-detail",
  templateUrl: "receiptDetails.html"
})
export class ReceiptDetail {
  total:any = this.navParams.get('total');
  date:any = this.navParams.get('date');
  currency:any = this.navParams.get('currency');
  constructor(public navParams: NavParams) {
     console.log(this.date);
  }
}
