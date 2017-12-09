import { StudentProfilePage } from './../student-profile/student-profile';
import { CreatePage } from './../create/create';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';
import { ISimpleAlertOptions, IStudent } from '../../common/interface';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AmaranthusDBProvider
  ) { }

  ionViewDidEnter() {
    this.query = "None";
    let interval = setInterval(() => {
      this.getStudents();
      if (this.students.length > 0) {
        clearInterval(interval);
      }
    }, 500);
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
    let fullName: string;
    const newQuery = students.filter(student => {
      fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      if (student.id == query ||
        student.firstName.toLowerCase() == query.toLowerCase() ||
        student.lastName.toLowerCase() == query.toLowerCase() ||
        fullName == query.toLowerCase()
      ) {
        return student;
      }
    });
    this.students = [...newQuery];
  }

  private async getStudents() {
    try {
      const response = await this.db.getAllActiveStudents();
      if (response.success == true) {
        this.students = [...response.data];
        this.untouchedStudentList = [...response.data];
      } else {
        // TODO:  implement an alert message if it fails
        // message should say no students can be retrieved.
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

  addAttendance(opts: { id: string }) {
    this.db.addAttendance({ date: new Date(), id: opts.id })
      .then(response =>
        response.success == true ?
          this.showSimpleAlert({
            title: 'Success!',
            subTitle: 'Student was marked present!',
            buttons: ['Ok']
          }) :
          this.handleError(response.error))
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    console.error(error);
  }

  addAbsence(opts: { id: string }) {
    this.db.addAbsence({ date: new Date(), id: opts.id })
      .then(response =>
        response.success == true ?
          this.showSimpleAlert({
            title: 'Success!',
            subTitle: 'Student was marked absent!',
            buttons: ['Ok']
          }) :
          this.handleError(response.error))
      .catch(error => this.handleError(error));

  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }
}
