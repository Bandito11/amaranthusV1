import { CreatePage } from './../create/create';
import { EditPage } from './../edit/edit';
import { IStudent } from './../../common/interface';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  ngOnInit() {
  }

  ionViewDidLoad() {
    this.getStudents();
  }

  ionViewWillEnter(){
    this.getStudents();    
  }
  students: IStudent[] = [];
  private untouchedStudentList: IStudent[] = [];

  initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  searchStudent(event) {
    // TODO: implement query of the list by searchbar value
    let query: string = event.target.value;
    query ? this.queryStudentsList(query) : this.initializeStudentsList();
  }

  queryStudentsList(query: string) {
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

  getStudents() {
    this.db.getAllStudents()
      .then(
      response => {
        if (response.success == true) {
          this.students = [...response.data];
          this.untouchedStudentList = [...response.data];
        } else {
          // TODO:  implement an alert message if it fails
          // message should say no students can be retrieved.
          this.handleError(response.error);
        }
      }      
      )
      .catch(error => this.handleError(error))
  }

  handleError(error) {
    // TODO:  error connecting to the database message
    console.error(error);
  }
  getStudentFullName(name: { firstName, lastName }): string {
    return `${name.firstName} ${name.lastName}`;
  }

  goToEdit(id) {
    this.navCtrl.push(EditPage, { id: id})
  }

  goToCreate(){
    this.navCtrl.push(CreatePage);
  }

  addAttendance(studentId) {
    //  TODO: implement attend event
    alert('attended ' + studentId)
  }

  addAbsence(studentId) {
    // TODO:  implement absence event
    alert('absent ' + studentId);
  }
}
