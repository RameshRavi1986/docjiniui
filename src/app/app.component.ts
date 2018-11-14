import { Component, ViewChild} from '@angular/core';
import {Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ReceiptsList } from '../pages/receipts/receipts';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
@ViewChild(Nav) nav: Nav;
 rootPage:any = HomePage;
 activePage:any;
 receiptsRoot=ReceiptsList;
 homeRoot = HomePage;
 pages:Array<{title:string, component:any}>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.pages = [
    {title:"ReceiptsList", component:ReceiptsList},
    {title:"Home", component:HomePage},
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  openPage(page){
	this.nav.setRoot(page.component);
	this.activePage = page;
   }
   checkActive(page){
	return page === this.activePage;
   }
}

