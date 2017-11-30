import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { ISimpleAlertOptions, IStudent } from './../../common/interface';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';


@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage implements OnInit {

  constructor(
    public db: AmaranthusDBProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }
  // HTML controls
  picture: string;
  gender: string;
  isActive: boolean;

  // HTML values
  student: IStudent;

  ngOnInit() {
    this.student = {
      id: '',
      firstName: '',
      initial: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      town: '',
      state: '',
      fatherFirstName: '',
      fatherLastName: '',
      motherFirstName: '',
      motherLastName: '',
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      emergencyRelationship: '',
      picture: '',
      gender: '',
      isActive: false
    };
    this.picture = "";
    this.gender = 'male';
    this.isActive = false;
  }

  ionViewDidLoad() {
    this.student = { ...this.student, id: this.navParams.get('id') };
    this.getStudentFromDB(this.student)
      .then(student => {
        this.isActive = student.isActive;
        this.gender = student.gender;
        this.picture = student.picture;
        this.student = { ...student };
      })
      .catch(error => handleError(error))
  }

  deleteStudent(opts: IStudent) {
    const options: ISimpleAlertOptions = {
      title: 'Success!',
      subTitle: 'Student was deleted.'
    };
    const alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'Are you sure you want to delete this record?',
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
            this.db.deleteStudent(opts)
              .then((response) => {
                if (response.success == true) {
                  navTransition.then(() => this.showAdvancedAlert(options));
                } else {
                  handleError(response.error);
                  const error: ISimpleAlertOptions = {
                    title: 'Error',
                    subTitle: 'There was an error trying to delete the record. Please try again.'
                  }
                  navTransition.then(() => this.showAdvancedAlert(error));
                }
              });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  validatePhoneNumber(phoneNumber) {
    if (phoneNumber.length >= 10 && phoneNumber.length <= 12) {
      return false;
    } else {
      return true;
    }
  }

  editStudent(opts: IStudent) {
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
        const picture = this.validatePicture({ gender: this.gender, picture: this.picture })
        const student = {
          ...opts,
          gender: this.gender,
          isActive: this.isActive,
          picture: picture
        }
        const alert = this.alertCtrl.create({
          title: 'Warning!',
          subTitle: `Are you sure you want to edit ${opts.firstName} ${opts.lastName} record?`,
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
                this.db.updateStudent(student)
                  .then((response) => {
                    if (response.success == true) {
                      navTransition.then(() => {
                        options = {
                          title: 'Success!',
                          subTitle: `${opts.firstName} ${opts.lastName} was edited.`
                        };
                        this.showAdvancedAlert(options);
                      });
                    } else {
                      handleError(response.error);
                      options = {
                        title: 'Error',
                        subTitle: 'There was an error trying to edit the record. Please try again.'
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
  }
  private validatePicture(opts: { gender: string, picture: string }) {
    if (opts.gender == 'male' && opts.picture == '') {
      opts.picture = "./assets/profilePics/defaultMale.jpg";
    } else if (opts.gender == 'female' && opts.picture == '') {
      opts.picture = "./assets/profilePics/defaultFemale.jpg";
    } else if (opts.gender == 'undisclosed' && opts.picture == '') {
      opts.picture = "./assets/profilePics/defaultUndisclosed.jpg";
    }
    return opts.picture;
  }

  getStudentFromDB(student: IStudent): Promise<IStudent> {
    return new Promise((resolve, reject) => {
      this.db.getStudentById(student)
        .then(response => {
          if (response.success == true) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => handleError(error));
    });
  }

  browsePicture() {
    this.picture = './assets/profilePics/MyPicture.jpg'
  }

  showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
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
                this.navCtrl.popToRoot();
              });
            return false;
          }
        }
      ]
    });
    alert.present();
  }
}
