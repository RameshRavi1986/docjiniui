import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ImageParseDataService} from '../common/services/imageparser.service'
import { RouterModule, Routes } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AppHeaderComponent} from '../common/header/d.header';
import {AppFooterComponent} from '../common/footer/d.footer';
import {CameraButtons} from '../common/modal/d.modal';
import { ReceiptsList } from '../pages/receipts/receipts';
import { ReceiptDetail } from '../pages/receiptdetails/receiptDetails';


/*const appRoutes: Routes = [
  { path: 'receipts-list', component: ReceiptsList },
  { path: 'receipt/:id',   component: ReceiptDetail },
  {
    path: 'home',
    component: HomePage,
    data: { title: 'Docjini Home' }
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];*/

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ReceiptsList,
    ReceiptDetail,
    AppHeaderComponent,
    AppFooterComponent,
    CameraButtons
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ReceiptsList,
    ReceiptDetail,
    CameraButtons
  ],
  providers: [
    Camera,
    ImageParseDataService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileOpener
  ]
})
export class AppModule {}
