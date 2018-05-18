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
    this.selectOptions = ['Id', 'Name', 'Active', 'Not Active', 'None'];
  }

  ionViewWillEnter() {
    this.query = "None";
    let studentInterval = setInterval(() => {
      this.getStudents();
      if (this.students.length > -1) {
        clearInterval(studentInterval);
      }
    }, 500);
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  searchStudent(event) {
    // TODO: implement query of the list by searchbar value
    let query: string = event.target.value;
    query ? this.queryStudentsList(query) : this.initializeStudentsList();
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
    let fullName: string;
    const newQuery = students.filter(student => {
      fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (student.id == query || student.firstName.toLowerCase() == query.toLowerCase() || student.lastName.toLowerCase() == query.toLowerCase() || fullName == query.toLowerCase()) {
        return student;
      }
    });
    this.students = [...newQuery];
  }

  private async getStudents() {
    try {
      const response = await this.db.getAllStudents();
      if (response.success == true) {
        this.students = [...response.data];
        this.untouchedStudentList = [...response.data];
      } else {
        // TODO:  implement an alert message if it fails message should say no students
        // can be retrieved.
        handleError(response.error);
      }
    } catch (error) {
      handleError(error);
    }
  }

  goToStudentProfile(id: string) {
    this.navCtrl.push(StudentProfilePage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }
}
