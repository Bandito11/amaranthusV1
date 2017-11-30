import { EditPage } from './../edit/edit';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { IStudent } from './../../common/interface';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';


@IonicPage()
@Component({
  selector: 'page-student-profile',
  templateUrl: 'student-profile.html',
})
export class StudentProfilePage implements OnInit {

  constructor(
    public db: AmaranthusDBProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }


  goToEdit(id: string) {
    this.navCtrl.push(EditPage, { id: id });
  }

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


}
