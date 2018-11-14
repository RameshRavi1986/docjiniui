import { Component, Input} from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImageParseDataService } from "../services/imageparser.service";
import { App, ViewController, ModalController, NavParams } from 'ionic-angular';
import { ReceiptsList } from '../../pages/receipts/receipts';
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Rx";


@Component({
    selector: 'd-modal',
    templateUrl: './d.modal.html',
})

export class CameraButtons {
    @Input() title: string;
    options:CameraOptions;

  constructor(
         private camera: Camera,
	 private imageParser: ImageParseDataService,
	 public appCtrl: App,
	 private storage: Storage,
         params:NavParams
  ) {}  
   openGallery(){
      this.options = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL
    };
    this.scanReceipt();
   }
   takePicture(){
   this.options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL
    };
    this.scanReceipt();
   }

   closeModal(){
	this.appCtrl.navPop();
   }
   scanReceipt() {
    const _self = this;
    this.camera.getPicture(this.options).then(
      imageData => {
        this.imageParser.parseImage(imageData).subscribe(
          data => { 
	    try{
            let result = this.imageParser.parseData(data);
	    alert(JSON.stringify(result));
	    let id = new Date().getTime();
	    result.img = "data:image/jpeg;base64,"+imageData;
	    result.id = id;
	    alert("Before setting storage");
	    _self.storage.set(id+"", JSON.stringify(result)).then((val) => {
		 alert(_self.storage.get(id+""));
		 alert("before moving to page");
		_self.appCtrl.getRootNav().select(1);
	    });
	    
	    }
	    catch (e){
	    alert(e);
	    }
          },
          error => {
	    alert(JSON.stringify(error));
            console.error("Error saving food!");
            return Observable.throw(error);
          }
        );
      },
      err => {
        alert(err);
      }
    );
  }
}