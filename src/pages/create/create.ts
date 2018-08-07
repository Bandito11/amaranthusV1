import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { IStudent, ISimpleAlertOptions } from '../../common/interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, normalizeURL, ViewController } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { trimText } from '../../common/formatToText';

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreatePage {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private db: AmaranthusDBProvider,
    private camera: Camera
  ) { }

  gender: string;
  picture: string;
  phoneNumber: string;
  idInput: string;

  counter = 0;
  ionViewWillEnter() {
    this.generateId();
    this.gender = 'male';
    this.picture = './assets/profilepics/default.png';
    this.phoneNumber = '';
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  generateId() {
    this.idInput = `XY${Math.ceil(Math.random() * 100000000)}`;
    try {
      const value = this.db.checkIfStudentExists({ id: this.idInput });
      if (!value) this.generateId();
    } catch (error) {
      handleError(error);
    }
  }

  browsePicture() {
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
        this.picture = normalizeURL(imageData);
      },
        error => handleError(error)
      )
  }

  createStudent(opts: IStudent) {
    let options: ISimpleAlertOptions = { title: '', subTitle: '', buttons: [] }
    if (!opts.firstName || !opts.lastName || !opts.id) {
      options = {
        ...options, title: 'Warning!',
        subTitle: 'Some fields doesn\'t have the required info',
        buttons: [...['OK']]
      }
      this.showSimpleAlert(options);
    } else {
      const picture = this.validatePicture({ gender: this.gender, picture: this.picture });
      const student: IStudent = {
        ...opts,
        picture: picture,
        gender: this.gender,
        isActive: true
      };
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: `Are you sure you want to create a new record for ${opts.firstName} ${opts.lastName}?`,
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              // user has clicked the alert button
              // begin the alert's dismiss transition
              const navTransition = alert.dismiss();
              this.db.insertStudent(student)
                .then((response) => {
                  if (response.success == true) {
                    navTransition.then(() => {
                      const options = {
                        title: 'Success!',
                        subTitle: `${opts.firstName} ${opts.lastName} was created.`
                      };
                      this.showAdvancedAlert(options);
                    });
                  } else {
                    const options = {
                      title: 'Error',
                      subTitle: response.error
                    }
                    navTransition.then(() => this.showAdvancedAlert(options));
                  }
                })
                .catch(error => this.showSimpleAlert({ title: 'Error', subTitle: error.error }));
              ;
              return false;
            }
          }
        ]
      });
      alert.present();
    }

  }

  showAdvancedAlert(options: ISimpleAlertOptions) {
    const alert = this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // user has clicked the alert button
            // begin the alert's dismiss transition
            alert.dismiss()
              .then(() => {
                this.navCtrl.pop();
              });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  private validatePicture(opts: { gender: string, picture: string }) {
    if (opts.gender == 'male' && opts.picture == '') {
      opts.picture = './assets/profilePics/defaultMale.png';
    } else if (opts.gender == 'female' && opts.picture == '') {
      opts.picture = './assets/profilePics/defaultFemale.png';
    } else if (opts.gender == 'undisclosed' && opts.picture == '') {
      opts.picture = './assets/profilePics/defaultUndisclosed.png';
    }
    return opts.picture;
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }
}
