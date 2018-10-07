import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL, ModalController, Platform, AlertController, ViewController } from 'ionic-angular';
import { handleError } from '../../../common/handleError';
import { IStudent, ISimpleAlertOptions, IEvent } from '../../../common/models';
import { CreatePage } from '../../create/create';
import { AmaranthusDBProvider } from '../../../providers/amaranthus-db/amaranthus-db';
import { addZeroInFront } from '../../../common/validation';

@IonicPage()
@Component({
  selector: 'page-createevent',
  templateUrl: 'createevent.html'
})
export class CreateEventPage {
  logo;
  students: IStudent[];
  STUDENTS: IStudent[];
  studentIds: string[];
  eventName;
  startDate;
  endDate;
  hasEndDate;
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
    this.logo = '';
    this.studentIds = [];
    this.getStudents();
    const currentDate = new Date();
    this.startDate = `${currentDate.getFullYear()}-${addZeroInFront(currentDate.getMonth() + 1)}-${addZeroInFront(currentDate.getDate())}`;
    this.endDate = '';
  }
  resetEndDate() {
    this.endDate = '';
  }
  createNewEvent() {
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
        return {
          id: studentId,
          attendance: false,
          absence: false,
          record: []
        };
      });
      let newEvent: IEvent = {
        logo: this.logo,
        name: this.eventName,
        startDate: '',
        members: members,
        endDate: '',
        infiniteDates: this.infiniteDates
      };
      if (!newEvent.infiniteDates){
        newEvent = {
          ...newEvent,
          startDate: this.startDate
        }
      }
      if (this.endDate && !newEvent.infiniteDates) {
        newEvent = {
          ...newEvent,
          endDate: this.endDate
        };
      }
      const alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: `Are you sure you want to create a new ${this.eventName}?`,
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              // user has clicked the alert button
              // begin the alert's dismiss transition
              const navTransition = alert.dismiss();
              const response = this.db.insertEvent(newEvent);
              if (response.success == true) {
                navTransition.then(() => {
                  const options = {
                    title: 'Success!',
                    subTitle: `${this.eventName} was created.`
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
      // this.logo = 'https://firebasestorage.googleapis.com/v0/b/ageratum-ec8a3.appspot.com/o/cordova_logo_normal_dark.png?alt=media&token=3b89f56e-8685-4f56-b5d7-2441f8857f97';
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
              this.viewCtrl.dismiss();
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  goBack() {
    this.viewCtrl.dismiss();
  }
}
