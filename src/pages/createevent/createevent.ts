import { LogoPreviewPage } from '../logopreview/logopreview';
import { ModalController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { IStudent } from '../../common/interface';

@IonicPage()
@Component({
  selector: 'page-createevent',
  templateUrl: 'createevent.html',
})
export class CreateEventPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private platform: Platform,
    private modalCtrl: ModalController
  ) {
  }

  logo: string;
  students: IStudent[];
  ionViewDidLoad() {
  }

  addLogo() {
    if (this.platform.is('cordova')) {
      const options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        targetWidth: 250,
        targetHeight: 250,
        destinationType: this.camera.DestinationType.FILE_URI,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.PNG
      };
      this.camera.getPicture(options)
        .then((imageData: string) => {
          this.logo = normalizeURL(imageData);
        },
          error => handleError(error)
        )
    } else {
      this.logo = 'https://firebasestorage.googleapis.com/v0/b/ageratum-ec8a3.appspot.com/o/cordova_logo_normal_dark.png?alt=media&token=3b89f56e-8685-4f56-b5d7-2441f8857f97';
    }
  }

  previewLogo() {
    this.modalCtrl.create(LogoPreviewPage, { logo: this.logo }).present();
  }

  addStudent() {
    //TODO: 
    // Create a SCREEN with a searchbar so that user can get the student data
    // User can also create a new Student and automatically add his data to the list
    //     
  }


}