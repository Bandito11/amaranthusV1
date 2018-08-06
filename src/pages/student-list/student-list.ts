import { ISimpleAlertOptions } from '../../common/interface';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { StudentProfilePage } from '../student-profile/student-profile';
import { CreatePage } from '../create/create';
import { IStudent } from '../../common/interface';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';

/**
 * Generated class for the StudentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-student-list', templateUrl: 'student-list.html' })
export class StudentListPage implements OnInit {

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public db: AmaranthusDBProvider) { }

  students: IStudent[];
  private untouchedStudentList: IStudent[];
  query: string;
  selectOptions: string[];

  ngOnInit() {
    this.students = [];
    this.untouchedStudentList = [];
    this.selectOptions = ['Id', 'Name', 'Active', 'Not Active', 'None'];
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };


  ionViewWillEnter() {
    this.query = "None";
    // let studentInterval = setInterval(() => {
      this.getStudents();
    //   if (this.students.length > 0) {
    //     clearInterval(studentInterval);
    //   }
    // }, 500);
  }
  searchStudent(event) {
    let query: string = event.target.value;
    query ? this.queryStudentsList(query) : this.initializeStudentsList();
  }

  private getStudents() {
    try {
      const response = this.db.getAllStudents();
      if (response.success == true) {
        this.students = [...response.data];
        this.untouchedStudentList = [...response.data];
      } else {
        const options: ISimpleAlertOptions = {
          title: 'Error',
          subTitle: response.error,
          buttons: ['OK', 'Cancel']
        }
        this.showSimpleAlert(options);
      }
    } catch (error) {
      handleError(error);
    }
  }

  queryData(option: string) {
    switch (option) {
      case 'Id':
        this.queryStudentsbyId();
        break;
      case 'Name':
        this.queryStudentsName();
        break;
      case 'Active':
      case 'Not Active':
        this.queryByIsActive(option);
        break;
      default:
        this.students = [...this.untouchedStudentList];
    }
  }

  queryByIsActive(query: string) {
    if (query == 'Active') {
      this.students = [
        ...this.students.sort((a, b) => {
          if (a.isActive == true)
            return -1;
          if (a.isActive == false)
            return 1;
          return 0;
        })
      ];
    } else {
      this.students = [
        ...this.students.sort((a, b) => {
          if (a.isActive == false)
            return -1;
          if (a.isActive == true)
            return 1;
          return 0;
        })
      ];
    }
  }

  queryStudentsbyId() {
    this.students = [
      ...this.students.sort((a, b) => {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      })
    ];
  }

  queryStudentsName() {
    this.students = [
      ...this.students.sort((a, b) => {
        if (a.firstName.toLowerCase() < b.firstName.toLowerCase())
          return -1;
        if (a.firstName.toLowerCase() > b.firstName.toLowerCase())
          return 1;
        return 0;
      })
    ];
  }

  private queryStudentsList(query: string) {
    const students = [...this.untouchedStudentList];
    let fullName;
    const newQuery = students.filter(student => {
      fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (student.id == query || student.firstName.toLowerCase() == query.toLowerCase() || student.lastName.toLowerCase() == query.toLowerCase() || fullName == query.toLowerCase()) {
        return student;
      }
    });
    this.students = [...newQuery];
  }

  goToStudentProfile(id: string) {
    this.navCtrl.push(StudentProfilePage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
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
