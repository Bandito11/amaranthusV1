import { EventsPage } from '../events/events';
import { StudentProfilePage } from '../student-profile/student-profile';
import { CreatePage } from '../create/create';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { ISimpleAlertOptions, IStudent, ICalendar } from '../../common/interface';

@IonicPage()
@Component({ selector: 'page-main', templateUrl: 'main.html' })
export class MainPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AmaranthusDBProvider,
    private modalCtrl: ModalController
  ) { }

  students: IStudent[];
  private untouchedStudentList: IStudent[];
  selectOptions: string[];
  filterOptions: string[];
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

  ionViewWillEnter() {
    let studentInterval = setInterval(() => {
      this.getStudents();
      this.filterOptions = this.getFilterOptions();
      if (this.students.length > 0) {
        clearInterval(studentInterval);
      }
    }, 500);
  }

  getFullName(opts: { firstName: string, initial: string, lastName: string }) {
    const firstName = opts.firstName.split('')[0].toUpperCase() + opts.firstName.slice(1, opts.firstName.length);
    const lastName = opts.lastName.split('')[0].toUpperCase() + opts.lastName.slice(1, opts.lastName.length)
    if (opts.initial) {
      const initial = opts.initial.split('')[0].toUpperCase() + opts.initial.slice(1, opts.initial.length)
      return `${firstName} ${initial} ${lastName}`;
    }
    else return `${firstName} ${lastName}`;
  }

  getFilterOptions() {
    let options = [];
    let checkIfHaveClass = this.students.filter(student => {
      if (student.class) return true;
    });
    for (const student of checkIfHaveClass) {
      if (options.indexOf(student.class) == -1) {
        options = [...options, student.class];
      }
    }
    options = [...options, 'None'];
    return options;
  };

  filterByClass(option: string) {
    if (option == 'None') {
      this.initializeStudentsList();
      return;
    }
    const students = [...this.untouchedStudentList];
    const newQuery = students.filter(student => {
      if (student.class == option) {
        return student;
      }
    });
    this.students = [...newQuery];
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

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

  sortData(option: string) {
    switch (option) {
      case 'Id':
        this.sortStudentsbyId();
        break;
      case 'Name':
        this.sortStudentsName();
        break;
      default:
        this.initializeStudentsList();
    }
  }

  private sortStudentsbyId() {
    this.students = [
      ...this.students.sort((a, b) => {
        if (a.id.slice(2, a.id.length) < b.id.slice(2, a.id.length)) return -1;
        if (a.id > b.id) return 1;
        return 0;
      })
    ];
  }

  private sortStudentsName() {
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

  addAttendance(opts: { id: string }) {
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
    this.navCtrl.push(StudentProfilePage, { id: id });
  }

  goToCreate() {
    const modal = this.modalCtrl.create(CreatePage);
    modal.onDidDismiss(_ => this.getStudents())
    modal.present();
  }

  goToEvents() {
    this.navCtrl.push(EventsPage);
  }
}
