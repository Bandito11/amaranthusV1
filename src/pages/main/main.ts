import { CreatePage } from './../create/create';
import { EditPage } from './../edit/edit';
import { IStudent } from './../../common/interface';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { handleError } from './../../common/handleError';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AmaranthusDBProvider) {
  }

  ionViewDidLoad() {
    this.getStudents();
  }
  students: IStudent[];
  private untouchedStudentList: IStudent[];
  query: string;
  selectOptions: string[];

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  ngOnInit() {
    this.students = [];
    this.untouchedStudentList = [];
    this.selectOptions = ['Id', 'Name', 'None'];
    this.query = "None";
  }

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
      default:
        this.students = [...this.untouchedStudentList];
    }
  }

  queryStudentsbyId() {
    this.students = [...this.students.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    })];
  }

  queryStudentsName() {
    this.students = [...this.students.sort((a, b) => {
      if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
      if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
      return 0;
    })];
  }

  private queryStudentsList(query: string) {
    const students = [...this.untouchedStudentList];
    let fullName = this.getStudentFullName;
    const newQuery = students.filter(student => {
      if (student.id == query ||
        student.firstName.toLowerCase() == query.toLowerCase() ||
        student.lastName.toLowerCase() == query.toLowerCase() ||
        fullName({ firstName: student.firstName, lastName: student.lastName }).toLowerCase() == query.toLowerCase()
      ) {
        return student;
      }
    });
    this.students = [...newQuery];
  }

  private getStudents() {
    this.db.getAllActiveStudents()
      .then(
      response => {
        if (response.success == true) {
          this.students = [...response.data];
          this.untouchedStudentList = [...response.data];
        } else {
          // TODO:  implement an alert message if it fails
          // message should say no students can be retrieved.
          handleError(response.error);
        }
      }
      )
      .catch(error => handleError(error))
  }


  getStudentFullName(name: { firstName, lastName }): string {
    return `${name.firstName} ${name.lastName}`;
  }

  goToEdit(id) {
    this.navCtrl.push(EditPage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }

  addAttendance(studentId) {
  }

  addAbsence(studentId) {
  }
}
