import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent, ISimpleAlertOptions } from './../../common/interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreatePage {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AmaranthusDBProvider,
    private camera: Camera
  ) { }

  gender: string;
  picture: string;
  phoneNumber: string;
  idInput: string;

  counter = 0;
  ionViewWillEnter() {
    this.getNewId();
    this.gender = 'male';
    this.picture = '';
    this.phoneNumber = '';
  }

  getNewId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.idInput = `XY${Math.ceil(Math.random() * 100000000)}`;
      this.db.checkIfUserExists({ id: this.idInput })
        .then(value => {
          value == false ? resolve(this.idInput) : this.getNewId();
        })
    });
  }

  browsePicture() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 150,
      targetHeight: 150,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.PNG
    };
    this.camera.getPicture(options)
      .then((imageData) => {
        this.picture = `data:image/png;base64,${imageData}`;
      },
        error => handleError(error)
      )
  }

  validatePhoneNumber(phoneNumber: string) {
    // if (phoneNumber.length >= 10 && phoneNumber.length <= 12) {
    //   return false;
    // } else {
    //   return true;
    // }
    if (phoneNumber.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  createStudent(opts: IStudent) {
    let options: ISimpleAlertOptions = { title: '', subTitle: '', buttons: [] }
    if (
      !opts.firstName ||
      !opts.lastName ||
      !opts.id //||
      // !opts.address ||
      // !opts.town ||
      // !opts.state
    ) {
      options = {
        ...options, title: 'Warning!',
        subTitle: 'Some fields doesn\'t have the required info',
        buttons: [...['OK']]
      }
      this.showSimpleAlert(options);
    } else {
      const phoneNumber = opts.phoneNumber
        .split('')
        .filter(phoneNumber => {
          if (phoneNumber != '-') {
            return phoneNumber;
          }
        })
        .join('');
      const emergencyContactPhoneNumber = opts.emergencyContactPhoneNumber
        .split('')
        .map(phoneNumber => {
          if (phoneNumber != '-') {
            return phoneNumber;
          }
        })
        .join('');
      // if(!phoneNumber){
      //   options = {
      //     ...options, title: 'Warning!',
      //     subTitle: 'You have to write a valid phone number.',
      //     buttons: [...['OK']]
      //   }
      //   this.showSimpleAlert(options);
      //   return;
      // } else if (!+phoneNumber) {
      //   options = {
      //     ...options, title: 'Warning!',
      //     subTitle: 'Phone numbers can only have numbers or \'-\'.',
      //     buttons: [...['OK']]
      //   }
      //   this.showSimpleAlert(options);
      //   return;

      // }
      if (phoneNumber) {
        if (!+phoneNumber) {
          options = {
            ...options, title: 'Warning!',
            subTitle: 'Phone numbers can only have numbers or \'-\'.',
            buttons: [...['OK']]
          }
          this.showSimpleAlert(options);
          return;
        }
      }

      if (emergencyContactPhoneNumber) {
        if (!+emergencyContactPhoneNumber) {
          options = {
            ...options, title: 'Warning!',
            subTitle: 'Phone numbers can only have numbers or \'-\'.',
            buttons: [...['OK']]
          }
          this.showSimpleAlert(options);
          return;
        }
      }
      // if ((phoneNumber.length < 10 || phoneNumber.length > 12)) {
      //   options = {
      //     ...options, title: 'Warning!',
      //     subTitle: 'Phone numbers have to be a 10 digit number.',
      //     buttons: [...['OK']]
      //   }
      //   this.showSimpleAlert(options);
      //   return;
      // }
      // if (emergencyContactPhoneNumber.length >= 10 && emergencyContactPhoneNumber.length <= 12) {
      //   if (!+emergencyContactPhoneNumber) {
      //     options = {
      //       ...options, title: 'Warning!',
      //       subTitle: 'Phone numbers can only have numbers or \'-\'.',
      //       buttons: [...['OK']]
      //     }
      //     this.showSimpleAlert(options);
      //     return;
      //   }
      // }
      // if ((emergencyContactPhoneNumber.length < 10 || emergencyContactPhoneNumber.length > 12) && emergencyContactPhoneNumber) {
      //   if (!+emergencyContactPhoneNumber) {
      //     options = {
      //       ...options, title: 'Warning!',
      //       subTitle: 'Phone numbers can only have numbers or \'-\'.',
      //       buttons: [...['OK']]
      //     }
      //   } else {
      //     options = {
      //       ...options, title: 'Warning!',
      //       subTitle: 'Emergency contact phone numbers have to be a 10 digit number.',
      //       buttons: [...['OK']]
      //     }
      //   }
      //   this.showSimpleAlert(options);
      //   return;
      // }
      opts = { ...opts, phoneNumber: phoneNumber, emergencyContactPhoneNumber: emergencyContactPhoneNumber };
      const picture = this.validatePicture({ gender: this.gender, picture: this.picture });
      const student: IStudent = { ...opts, picture: picture, gender: this.gender, isActive: true };
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: `Are you sure you want to create a new record for ${opts.firstName} ${opts.lastName}?`,
        buttons: [
          {
            text: 'No'
          },
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
                      options = {
                        title: 'Success!',
                        subTitle: `${opts.firstName} ${opts.lastName} was created.`
                      };
                      this.showAdvancedAlert(options);
                    });
                  } else {
                    options = {
                      title: 'Error',
                      subTitle: response.error
                    }
                    navTransition.then(() => this.showAdvancedAlert(options));
                  }
                })
                .catch(error => this.showSimpleAlert({ title: 'Error', subTitle: error }));
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
      opts.picture = "./assets/profilePics/defaultMale.png";
    } else if (opts.gender == 'female' && opts.picture == '') {
      opts.picture = "./assets/profilePics/defaultFemale.png";
    } else if (opts.gender == 'undisclosed' && opts.picture == '') {
      opts.picture = "./assets/profilePics/defaultUndisclosed.png";
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
