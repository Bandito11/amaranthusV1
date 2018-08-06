import { ModalController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { IStudent } from '../../common/interface';
import { CreatePage } from '../create/create';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { addZeroInFront } from '../../common/validation';

@IonicPage()
@Component({
  selector: 'page-createevent',
  templateUrl: 'createevent.html',
})
export class CreateEventPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public platform: Platform,
    public modalCtrl: ModalController,
    public db: AmaranthusDBProvider
  ) {
  }

  logo;
  students: IStudent[];
  STUDENTS: IStudent[];
  studentIds: IStudent[];
  eventName;
  startDate;
  endDate;
  hasEndDate;
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
    if (
      this.studentIds.length > 0 &&
      this.startDate &&
      this.eventName && 
      this.logo
    ) {
      // TODO: Create Events Collection
    }else{
      //TODO: Custom ionic style Error message!!!
    }
  }

  getStudents() {
    this.students = [];
    this.STUDENTS = [];
    const response = this.db.getAllStudents();
    if (response.success) {
      this.students = [...response.data];
      this.STUDENTS = [...response.data]
    }
  }

  private initializeStudentsList() {
    this.students = [...this.STUDENTS];
  };

  search(event) {
    const query = event.target.value;
    query ? this.filterStudentsList(query) : this.initializeStudentsList();
  }

  private filterStudentsList(query: string) {
    const students = [...this.STUDENTS];
    let fullName: string;
    const newQuery = students.filter(student => {
      fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (
        student.id == query ||
        student.firstName.toLowerCase().includes(query.toLowerCase()) ||
        student.lastName.toLowerCase().includes(query.toLowerCase()) ||
        fullName == query.toLowerCase()) {
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
      this.camera.getPicture(options)
        .then((imageData) => {
          this.logo = normalizeURL(imageData);
        },
          error => handleError(error)
        )
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
    this.modalCtrl.create(CreatePage).present();
  }
  ifOnEventList(id) {
    if (this.studentIds.indexOf(id) != -1) return true
    return false;
  }


}