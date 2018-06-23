import { StudentProfilePage } from './../student-profile/student-profile';
import { CreatePage } from './../create/create';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { handleError } from './../../common/handleError';
import { ISimpleAlertOptions, IStudent, ICalendar } from '../../common/interface';

@IonicPage()
@Component({ selector: 'page-main', templateUrl: 'main.html' })
export class MainPage implements OnInit {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private db: AmaranthusDBProvider) { }

  students: IStudent[];
  private untouchedStudentList: IStudent[];
  query: string;
  selectOptions: string[];
  date: ICalendar;

  ngOnInit() {
    this.students = [];
    this.untouchedStudentList = [];
    const currentDate = new Date();
    this.date = {
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      year: currentDate.getFullYear()
    }
    this.selectOptions = ['Id', 'Name', 'None'];
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  ionViewWillEnter() {
    this.query = "None";
    let studentInterval = setInterval(() => {
      this.getStudents();
      if (this.students.length > 0) {
        clearInterval(studentInterval);
      }
    }, 500);
  }

  searchStudent(event) {
    let query: string = event.target.value;
    query ? this.filterStudentsList(query) : this.initializeStudentsList();
  }

  private getStudents() {
    const date = {
      ...this.date,
      month: this.date.month + 1
    }
    try {
      const studentResponse = this.db.getAllActiveStudents(date);
      if (studentResponse.success == true) {
        this.students = [...studentResponse.data];
        this.untouchedStudentList = [...studentResponse.data];
      } else {
        handleError(studentResponse.error);
      }
    } catch (error) {
      handleError(error);
    }
  }

  filterData(option: string) {
    switch (option) {
      case 'Id':
        this.filterStudentsbyId();
        break;
      case 'Name':
        this.filterStudentsName();
        break;
      default:
        this.students = [...this.untouchedStudentList];
    }
  }

  private filterStudentsbyId() {
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

  private filterStudentsName() {
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

  private filterStudentsList(query: string) {
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

  addAttendance(opts: {
    id: string
  }) {
    const response = this.db.addAttendance({ date: this.date, id: opts.id });
    if (response.success == true) {
      this.updateStudentAttendance({
        id: opts.id,
        absence: false,
        attendance: true
      });
      this.showSimpleAlert({
        title: 'Success!',
        subTitle: 'Student was marked present!',
        buttons: ['OK']
      });
    } else {
      handleError(response.error)
    }
  }

  addAbsence(opts: {
    id: string
  }) {
    const response = this.db.addAbsence({ date: this.date, id: opts.id });
    if (response.success == true) {
      this.updateStudentAttendance({
        id: opts.id,
        absence: true,
        attendance: false
      });
      this.showSimpleAlert({
        title: 'Success!',
        subTitle: 'Student was marked absent!',
        buttons: ['OK']
      });
    } else {
      handleError(response.error);
    }
  }

  private updateStudentAttendance(opts: {
    id: string,
    absence: boolean,
    attendance: boolean
  }) {
    const results = this.students.map(student => {
      if (student.id == opts.id) {
        return {
          ...student,
          attendance: opts.attendance,
          absence: opts.absence
        };
      } else {
        return student;
      }
    });
    this.students = [...results];
    this.untouchedStudentList = [...results];
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();
  }

  goToStudentProfile(id: string) {
    this.navCtrl.push(StudentProfilePage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }
}
