import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent, ISimpleAlertOptions } from './../../common/interface';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';

/**
 * TODO:
 * Add required to input
 * make sure data is validated before inserting into DB. 
 */

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreatePage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AmaranthusDBProvider
  ) { }

  /**
   * Can have a value of male, female or undisclosed depending on user input
   * 
   * @type {string}
   * @memberof CreatePage
   */
  gender: string;
  picture: string;
  phoneNumber: string;

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.gender = 'male';
    this.picture = '';
    this.phoneNumber = '';

  }
  // TODO: Implement a gallery menu to look for a picture.
  browsePicture() {
    this.picture = './assets/profilePics/MyPicture.jpg'
  }

  validatePhoneNumber(phoneNumber) {
    if (phoneNumber.length >= 10 && phoneNumber.length <= 12) {
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
      !opts.id ||
      !opts.address ||
      !opts.town ||
      !opts.state ||
      !opts.fatherFirstName ||
      !opts.fatherLastName ||
      !opts.motherFirstName ||
      !opts.motherLastName ||
      !opts.emergencyContactName
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
        .map(phoneNumber => {
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
      if (+phoneNumber == NaN || +emergencyContactPhoneNumber == NaN) {
        options = {
          ...options, title: 'Warning!',
          subTitle: 'Phone numbers can only have numbers or \'-\'.',
          buttons: [...['OK']]
        }
        this.showSimpleAlert(options);
      } else if (phoneNumber.length < 10 && phoneNumber.length > 0) {
        options = {
          ...options, title: 'Warning!',
          subTitle: 'Phone numbers have to be a 10 digit number.',
          buttons: [...['OK']]
        }
        this.showSimpleAlert(options);
      } else if (emergencyContactPhoneNumber.length < 10 && emergencyContactPhoneNumber.length > 0) {
        options = {
          ...options, title: 'Warning!',
          subTitle: 'Emergency contact phone numbers have to be a 10 digit number.',
          buttons: [...['OK']]
        }
        this.showSimpleAlert(options);
      } else {
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
                  .catch(error => handleError(error));
                ;
                return false;
              }
            }
          ]
        });
        alert.present();
      }
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

  private validatePicture(data: { gender: string, picture: string }) {
    if (data.gender == 'male' && data.picture == '') {
      data.picture = "./assets/profilePics/defaultMale.jpg";
    } else if (data.gender == 'female' && data.picture == '') {
      data.picture = "./assets/profilePics/defaultFemale.jpg";
    } else if (data.gender == 'undisclosed' && data.picture == '') {
      data.picture = "./assets/profilePics/defaultUndisclosed.jpg";
    }
    return data.picture;
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
