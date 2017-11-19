import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent } from './../../common/interface';
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
  resetPicture() {
    this.picture = '';
  }
  async createStudent(data: IStudent) {
    if (!data.firstName ||
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
      !data.emergencyContactPhoneNumber) {
      this.showSimpleAlert({ title: 'Warning!', subTitle: 'Some fields doesn\'t have the required info', buttons: ['OK'] });
    } else {
      if (this.gender == 'male' && this.picture == '') {
        this.picture = "./assets/profilePics/defaultMale.jpg";
      } else if (this.gender == 'female' && this.picture == '') {
        this.picture = "./assets/profilePics/defaultFemale.jpg";
      } else if (this.gender == 'undisclosed' && this.picture == '') {
        this.picture = "./assets/profilePics/defaultUndisclosed.jpg";
      }
      const student: IStudent = { ...data, picture: this.picture, gender: this.gender, isActive: true };
      try {
        await this.db.insertStudent(student);
        const alert = this.alertCtrl.create({
          title: 'Successful',
          subTitle: 'Student was created succesfully!',
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
      }
    }
  }

  showSimpleAlert(data: { title: string, subTitle: string, buttons: string[] }) {
    return this.alertCtrl.create({
      title: data.title,
      subTitle: data.subTitle,
      buttons: data.buttons
    });
  }
}
