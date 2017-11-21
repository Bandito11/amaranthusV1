import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent, ISimpleAlertOptions } from './../../common/interface';
import { Component } from '@angular/core';
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
  templateUrl: 'create.html',
})
export class CreatePage {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private db: AmaranthusDBProvider) {
  }

  /**
   * Can have a value of male, female or undisclosed depending on user input
   * 
   * @type {string}
   * @memberof CreatePage
   */
  gender: string = 'male';
  picture: string = '';

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }

  /**
   * Find a picture from the native gallery
   * 
   * @memberof CreatePage
   */
  browsePicture() {
    // TODO: Implement a gallery menu to look for a picture. 
    this.picture = './assets/profilePics/MyPicture.jpg'
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
      !opts.emergencyContactName ||
      !opts.emergencyContactPhoneNumber
    ) {
      options.title = 'Warning!';
      options.subTitle = 'Some fields doesn\'t have the required info';
      options.buttons = [...['OK']]
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
                    handleError(response.error);
                    options = {
                      title: 'Error',
                      subTitle: 'There was an error trying to create the record. Please try again.'
                    }
                    navTransition.then(() => this.showAdvancedAlert(options));
                  }
                });
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
