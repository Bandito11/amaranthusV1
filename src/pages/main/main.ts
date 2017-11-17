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
    this.getStudents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage')
  }

  students;

  searchStudent(event) {
    // TODO: implement query of the list by searchbar value
    const query = event.target.value;
    query ? alert(query) : alert('empty');
  }

  getStudents() {
    this.db.getAllStudents()
      .retry(3)
      .subscribe(
      response => {
        if (response.success == true) {
          this.students = response.data.students;
        } else {
          // TODO:  implement an alert message if it fails
          // message should say no students can be retrieved.
          this.handleError(response.error);
        }
      },
      error => this.handleError(error)
      )
  }

  handleError(error) {
    // TODO:  error connecting to the database message
    console.error(error);
  }
  getStudentFullName(name: { firstName, lastName }) {
    return `${name.firstName} ${name.lastName}`;
  }

  goToEdit(studentId) {
    //  TODO:  implement edit component
    alert('edit ' + studentId);
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
