import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ICalendar, IRecord, ISimpleAlertOptions } from '../../common/interface';
import { monthsLabels, weekDaysHeader } from '../../common/labels';
import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  constructor(
    public alertCtrl: AlertController,
    public db: AmaranthusDBProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  currentDate: string;
  students: IRecord[];
  private untouchedStudentList: IRecord[];
  private date: ICalendar;

  ionViewWillEnter() {
    this.getStudentsRecords(this.date);
  }


  getStudentsRecords(opts: ICalendar) {
    // Will get all Students queried by today's date.
    const date = { ...opts, month: opts.month + 1 }
    try {
      const response = this.db.getStudentsRecordsByDate(date)
      if (response.success == true) {
        this.students = [...response.data];
        this.untouchedStudentList = [...response.data];
      } else {
        handleError(response.error);
      }
    } catch (error) {
      handleError(error)
    }
  }

  getDate(date: ICalendar) {
    this.date = date;
    const currentDay = date.day;
    const currentMonth = monthsLabels[date.month];
    const currentYear = date.year;
    const currentWeekDay = weekDaysHeader[date.weekDay];
    this.currentDate = `${currentWeekDay}, ${currentDay} ${currentMonth}, ${currentYear}`;
    this.getStudentsRecords(date);
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

  addAbsence(opts: { id: string }) {
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
      .present();;
  }

  searchStudent(event) {
    // TODO: implement query of the list by searchbar value
    let query: string = event.target.value;
    query ? this.queryStudentsList(query) : this.initializeStudentsList();
  }

  private initializeStudentsList() {
    this.students = [...this.untouchedStudentList];
  };

  private queryStudentsList(query: string) {
    const students = [...this.untouchedStudentList];
    let fullName: string;
    const newQuery = students.filter(student => {
      fullName = `${student.fullName} ${student.fullName}`.toLowerCase();
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

}
