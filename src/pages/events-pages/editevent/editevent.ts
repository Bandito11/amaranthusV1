import { AmaranthusDBProvider } from './../../../providers/amaranthus-db/amaranthus-db';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, AlertController, ViewController, normalizeURL } from 'ionic-angular';
import { IStudent, ISimpleAlertOptions, IEvent } from '../../../common/models';
import { handleError } from '../../../common/handleError';
import { CreatePage } from '../../create/create';

@IonicPage()
@Component({
  selector: 'page-editevent',
  templateUrl: 'editevent.html'
})
export class EditEventPage {
  id;
  logo;
  students: IStudent[];
  STUDENTS: IStudent[];
  studentIds: string[];
  eventName;
  startDate;
  endDate;
  hasEndDate;
  event: IEvent & LokiObj;
  infiniteDates: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public platform: Platform,
    public modalCtrl: ModalController,
    public db: AmaranthusDBProvider,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    this.getStudents();
    // const currentDate = new Date();
    // this.startDate = `${currentDate.getFullYear()}-${addZeroInFront(currentDate.getMonth() + 1)}-${addZeroInFront(currentDate.getDate())}`;
    this.id = this.navParams.get('id');
    this.getEventProfile(this.id);
  }

  getEventProfile(id) {
    this.studentIds = [];
    const response = this.db.getEvent(id);
    if (response.success) {
      this.event = { ...response.data };
      // let members = [];
      // for (const member of response.data.members) {
      //   const studentResponse = this.db.getStudentById(<any>member);
      //   if (studentResponse.success) {
      //     members = [...members, {
      //       id: studentResponse.data.id,
      //       firstName: studentResponse.data.firstName,
      //       initial: studentResponse.data.initial,
      //       lastName: studentResponse.data.lastName,
      //       phoneNumber: studentResponse.data.phoneNumber,
      //       picture: studentResponse.data.picture,
      //       class: studentResponse.data.class,
      //       attendance: member.attendance,
      //       absence: member.absence
      //     }];
      //   }
      // }
      this.infiniteDates = this.event.infiniteDates;
      this.logo = response.data.logo;
      this.eventName = response.data.name;
      this.startDate = response.data.startDate;
      this.endDate = response.data.endDate;
      // this.students = members;
      this.studentIds = response.data.members.map(member => member.id);
    } else handleError(response.error);
  }

  resetEndDate() {
    this.endDate = '';
  }

  editEvent() {
    try {
      if (this.studentIds.length < 1) {
        const opts: ISimpleAlertOptions = {
          title: 'Error',
          subTitle: 'Have to choose at least one user from the list!'
        };
        this.showSimpleAlert(opts);
        return;
      }
      if (!this.startDate && !this.infiniteDates) {
        const opts: ISimpleAlertOptions = {
          title: 'Error',
          subTitle: 'Have to choose a start date!'
        };
        this.showSimpleAlert(opts);
        return;
      }
      if (!this.eventName) {
        const opts: ISimpleAlertOptions = {
          title: 'Error',
          subTitle: 'Have to write a name for the event!'
        };
        this.showSimpleAlert(opts);
        return;
      }

      const members = this.studentIds.map(studentId => {
        const member = this.event.members.find(member => studentId == member.id);
        if (member) {
          return member;
        } else {
          return {
            id: studentId,
            attendance: false,
            absence: false
          };
        }
      });
      this.event = {
        ...this.event,
        logo: this.logo,
        name: this.eventName,
        startDate: '',
        members: [...members],
        endDate: '',
        infiniteDates: this.infiniteDates
      };
      if (!this.event.infiniteDates) {
        this.event = {
          ...this.event,
          startDate: this.startDate
        };
      }
      if (this.endDate && !this.event.infiniteDates) {
        this.event = {
          ...this.event,
          endDate: this.endDate
        };
      }
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: `Are you sure you want to edit ${this.eventName} event?`,
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              // user has clicked the alert button
              // begin the alert's dismiss transition
              const navTransition = alert.dismiss();
              const response = this.db.updateEvent(this.event);
              if (response.success == true) {
                navTransition.then(() => {
                  const options = {
                    title: 'Success!',
                    subTitle: `${this.eventName} was edited successfully.`
                  };
                  this.showAdvancedAlert(options);
                });
              } else {
                const options = {
                  title: 'Error',
                  subTitle: response.error
                };
                navTransition.then(() => this.showAdvancedAlert(options));
              }
              return false;
            }
          }
        ]
      });
      alert.present();
    } catch (error) {
      const opts: ISimpleAlertOptions = {
        title: 'Error',
        subTitle: error
      };
      this.showSimpleAlert(opts);
    }
  }

  getStudents() {
    this.students = [];
    this.STUDENTS = [];
    const response = this.db.getAllStudents();
    if (response.success) {
      this.students = [...response.data];
      this.STUDENTS = [...response.data];
    }
  }

  private initializeStudentsList() {
    this.students = [...this.STUDENTS];
  }

  search(event) {
    const query = event.target.value;
    query ? this.filterStudentsList(query) : this.initializeStudentsList();
  }

  private filterStudentsList(query: string) {
    const students = [...this.STUDENTS];
    let fullName: string;
    const newQuery = students.filter(student => {
      fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (student.id == query || student.firstName.toLowerCase().includes(query.toLowerCase()) || student.lastName.toLowerCase().includes(query.toLowerCase()) || fullName == query.toLowerCase()) {
        return student;
      }
    });
    this.students = [...newQuery];
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
      this.camera.getPicture(options).then(
        imageData => {
          this.logo = normalizeURL(imageData);
        },
        error => handleError(error)
      );
    } else {
      // Only for Dev Purposes
      this.logo = 'https://firebasestorage.googleapis.com/v0/b/ageratum-ec8a3.appspot.com/o/cordova_logo_normal_dark.png?alt=media&token=3b89f56e-8685-4f56-b5d7-2441f8857f97';
    }
  }

  addToEvent(id) {
    if (this.studentIds.indexOf(id) == -1) this.studentIds = [...this.studentIds, id];
  }

  removeFromEvent(id) {
    const newStudentIds = [...this.studentIds.slice(0, this.studentIds.indexOf(id)), ...this.studentIds.slice(this.studentIds.indexOf(id) + 1, this.studentIds.length)];
    this.studentIds = [...newStudentIds];
  }

  addStudent() {
    const modal = this.modalCtrl.create(CreatePage);
    modal.onDidDismiss(_ => this.getStudents());
    modal.present();
  }

  ifOnEventList(id) {
    if (this.studentIds.indexOf(id) != -1) return true;
    return false;
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl
      .create({
        title: options.title,
        subTitle: options.subTitle,
        buttons: options.buttons
      })
      .present();
  }

  private showAdvancedAlert(options: ISimpleAlertOptions) {
    const alert = this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // user has clicked the alert button
            // begin the alert's dismiss transition
            alert.dismiss().then(() => {
              this.viewCtrl.dismiss(this.id);
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  removeEvent() {
    try {
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: `Are you sure you want to delete ${this.eventName} event?`,
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              // user has clicked the alert button
              // begin the alert's dismiss transition
              const navTransition = alert.dismiss();
              const response = this.db.removeEvent(this.event);
              if (response.success == true) {
                this.id = undefined;
                navTransition.then(() => {
                  const opts = {
                    title: 'Success!',
                    subTitle: 'Event was removed successfully from DB!'
                  };
                  this.showAdvancedAlert(opts);
                });
              } else {
                const options = {
                  title: 'Error',
                  subTitle: response.error
                };
                navTransition.then(() => this.showAdvancedAlert(options));
              }
              return false;
            }
          }
        ]
      });
      alert.present();
    } catch (error) {
      handleError(error);
    }
  }

  goBack() {
    this.viewCtrl.dismiss(this.id);
  }
}
