import { Component } from "@angular/core";
import { Storage } from '@ionic/storage';
import {NavController, Platform, AlertController, App, ViewController, ModalController, NavParams  } from 'ionic-angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ReceiptDetail} from '../receiptdetails/receiptDetails';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
 
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: "receipts",
  templateUrl: "receiptsList.html"
})
export class ReceiptsList {
  receipts: any =[];
  docDefinition: any={};
  editEnabled: boolean = false;
  pdfObj:any;
  content:any=[];
  constructor(
  private storage: Storage, 
  private platform: Platform,
  private file: File, 
  private fileOpener: FileOpener, 
  private alertCtrl: AlertController,
  private modalCtrl: ModalController) {
  
  }

  ionViewWillEnter(){
   var _self =this;
    alert("inside receiptsList");
    this.receipts=[{id:2,total:3.55, date:'22/11/2017'}];
    alert(this.storage.length());
    this.storage.ready().then(() => {
    this.storage.forEach((v,k,i) => {
         alert(v);
        _self.receipts.push(JSON.parse(v));
    });
   }).catch((error: Error) => {
    alert("error storage");
    alert(error);
    return;
   });
  }

  convertToPdf(){
     this.receipts.forEach((value,index,list) => {
     alert(this.receipts[index].enabled);
            if(this.receipts[index].enabled){
		let imageFile = this.receipts[index].img; 
		this.content.push({image:imageFile,fit: [100, 100]});
	    }
     });
     alert(this.content.length);
     if(this.content.length>0){
       this.docDefinition.content= this.content;
       alert(this.docDefinition.content);
       alert(this.content);
       this.pdfObj = pdfMake.createPdf(this.docDefinition);
       this.downloadPdf();
       this.content=[];
       this.docDefinition ={};
     }
  }

  downloadPdf(){
  console.log("DownloadPdf() triggered")
    if (this.platform.is('cordova')) {
    alert("inside cordova");
    this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'test.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'test.pdf', 'application/pdf').then(() => alert('File is opened')).catch(e => alert(e));
	  this.pdfObj={};
        })
      });
    } else {
      alert("inside cordova else before download");
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
  gotoReceiptDetail(id){
  let _self=this;
  if(!this.editEnabled){
   this.receipts.forEach((value,index,list) => {
            if(this.receipts[index].id){
		if(this.receipts[index].id === id){
			let profileModal = this.modalCtrl.create(ReceiptDetail, _self.receipts[index]);
			profileModal.present();
		}
	    }
     });
   }
  }
  deleteReceipts(){
  let tempReceipts=[];
	this.receipts.forEach((value,index,list) => {
            if(!this.receipts[index].enabled){
		tempReceipts.push(this.receipts[index]);
	    }
	    else{
		this.storage.remove(this.receipts[index].id);
	    }
     });	
     this.receipts = tempReceipts;
  }

  editAllReceipts(){
   if(!this.editEnabled){
	var _self =this;
	this.editEnabled=true;
   }
   else{
    this.receipts.forEach((value,index,list) => {
        this.receipts[index].enabled=false;
    });	
    this.editEnabled=false;
   }
  }

 presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Confirm delete receipts?',
    message: 'If you click delete it will erase all your selected receipts. Are you sure want to delete?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log("cancel clicked");
        }
      },
      {
        text: 'Delete',
        handler: () => {
          this.deleteReceipts();
        }
      }
    ]
  });
  alert.present();
}

 
}
