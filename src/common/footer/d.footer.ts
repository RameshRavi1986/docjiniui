import { Component, Input} from '@angular/core';
import { ModalController } from 'ionic-angular';
import {CameraButtons } from '../modal/d.modal';


@Component({
    selector: 'd-footer',
    templateUrl: './d.footer.html',
})

export class AppFooterComponent {
    @Input() title: string;


  constructor(
	 public modalCtrl: ModalController
  ) {}  
  presentCameraButtons(){
	 let profileModal = this.modalCtrl.create(CameraButtons, { userId: 8675309 });
          profileModal.present();
  }
}