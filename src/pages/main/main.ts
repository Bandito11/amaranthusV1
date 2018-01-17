import { StudentProfilePage } from './../student-profile/student-profile';
import { CreatePage } from './../create/create';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';
import { ISimpleAlertOptions, IStudent } from '../../common/interface';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AmaranthusDBProvider
  ) { }

  students: IStudent[];
  private untouchedStudentList: IStudent[];
  query: string;
  selectOptions: string[];

  ionViewDidEnter() {
    this.query = "None";
    let studentInterval = setInterval(() => {
      this.getStudents();
      if (this.students.length > -1) {
        clearInterval(studentInterval);
      }
    }, 500);
  }

  ngOnInit() {
    this.students = [];
    this.untouchedStudentList = [];
    this.selectOptions = ['Id', 'Name', 'None'];
    this.query = "None";
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  private async getStudents() {
    try {
      const studentResponse = await this.db.getAllActiveStudents();
      if (studentResponse.success == true) {
        this.students = studentResponse.data;
        this.untouchedStudentList = studentResponse.data;
      } else {
        // TODO:  implement an alert message if it fails
        // message should say no students can be retrieved.
        handleError(studentResponse.error);
      }
    } catch (error) {
      handleError(error);
    }
  }

  searchStudent(event) {
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

  addAttendance(opts: { id: string }) {
    this.db.addAttendance({ date: new Date(), id: opts.id })
      .then(response => {
        if (response.success == true) {
          this.updateStudentAttendance({ id: opts.id, attended: true });
          this.showSimpleAlert({
            title: 'Success!',
            subTitle: 'Student was marked present!',
            buttons: ['Ok']
          });
        } else {
          handleError(response.error)
        }
      })
      .catch(error => handleError(error));
  }

  addAbsence(opts: { id: string }) {
    this.db.addAbsence({ date: new Date(), id: opts.id })
      .then(response => {
        if (response.success == true) {
          this.updateStudentAttendance({ id: opts.id, attended: false });
          this.showSimpleAlert({
            title: 'Success!',
            subTitle: 'Student was marked absent!',
            buttons: ['Ok']
          });
        } else {
          handleError(response.error);
        }
      })
      .catch(error => handleError(error));

  }

  updateStudentAttendance(opts: { id: string, attended: boolean }) {
    const results = this.students.map(student => {
      if (student.id == opts.id) {
        return { ...student, attended: opts.attended };
      } else {
        return student;
      }
    });
    this.students = [...results];
    this.untouchedStudentList = [...results];
  }

  getAttendance(opts: { attended: boolean }) {
    if (opts.attended == true) {
      return true;
    } else if (opts.attended == false) {
      return false;
    } else {
      return null;
    }
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }

  goToStudentProfile(id: string) {
    this.navCtrl.push(StudentProfilePage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }
}
