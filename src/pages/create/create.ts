import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent, ISimpleAlertOptions } from './../../common/interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
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
  gender = 'male';
  picture = '';

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
  async createStudent(data: IStudent) {
    const options: ISimpleAlertOptions = {title:'', subTitle:'',buttons:[]}
    if (
      !data.firstName ||
      !data.lastName ||
      !data.id ||
      !data.address ||
      !data.town ||
      !data.state ||
      !data.fatherFirstName ||
      !data.fatherLastName ||
      !data.motherFirstName ||
      !data.motherLastName ||
      !data.emergencyContactName ||
      !data.emergencyContactPhoneNumber
    ) {
      options.title = 'Warning!';
      options.subTitle = 'Some fields doesn\'t have the required info';
      options.buttons = [...['OK']]
      this.showSimpleAlert(options);
    } else {
      const picture = this.validatePicture({gender: this.gender, picture: this.picture});
      const student: IStudent = { ...data, picture: picture, gender: this.gender, isActive: true };
      try {
        await this.db.insertStudent(student);
        const alert = this.alertCtrl.create({
          title: 'Successful',
          subTitle: 'Student was created successfully!',
          buttons: [{
            text: 'Ok',
            handler: () => {
              alert.dismiss()
                .then(() => {
                  this.navCtrl.pop();
                });
              return false;
            }
          }]
        });
        alert.present();
      } catch (error) {
        console.error(error);
        options.title = 'Error!';
        options.subTitle = 'There was an error creating a student record! Please try again.';
        options.buttons = [...['OK']]
        this.showSimpleAlert(options);  
      }
    }
  }

  validatePicture(options: {gender: string, picture: string}) {
    if (options.gender == 'male' && options.picture == '') {
      options.picture = "./assets/profilePics/defaultMale.jpg";
    } else if (options.gender == 'female' && options.picture == '') {
      options.picture = "./assets/profilePics/defaultFemale.jpg";
    } else if (options.gender == 'undisclosed' && options.picture == '') {
      options.picture = "./assets/profilePics/defaultUndisclosed.jpg";
    }
    return options.picture;
  }

  showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }
}
