import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { ICalendar, IRecord, ISimpleAlertOptions } from '../../../common/models';
import { MONTHSLABELS, WEEKDAYSHEADER } from '../../../common/constants';
import { handleError } from '../../../common/handleError';
import { AmaranthusDBProvider } from '../../../providers/amaranthus-db/amaranthus-db';
import { filterStudentsList } from '../../../common/search';

@IonicPage()
@Component({
  selector: 'page-calendar-events',
  templateUrl: 'calendar-events.html'
})
export class CalendarEventsPage {
  currentDate: string;
  students: IRecord[];
  private unfilteredStudents: IRecord[];
  private date: ICalendar;
  timer: number;
  @ViewChild('notes')
  notesElement: ElementRef;
  toggle: string;
  search: string;
  event;
  
  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, public db: AmaranthusDBProvider, public navCtrl: NavController, public navParams: NavParams) {}

  ionViewWillEnter() {
    this.timer = 0;
    this.event = this.navParams.get('event');
    this.getStudentsRecords(this.date);
  }

  showNotes(id) {
    if (this.toggle) {
      this.toggle = '';
    } else {
      this.toggle = id;
      setTimeout(() => {
        this.notesElement.nativeElement.focus();
      }, 0);
    }
  }

  addNotes(opts: { id: string; notes: string }) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const newNote = {
        ...opts,
        month: this.date.month,
        day: this.date.day,
        year: this.date.year
      };
      this.db.insertNotes(newNote);
      this.updateNotes(opts);
    }, 1000);
  }

  updateNotes(opts: { id: string; notes: string }) {
    const index = this.students.findIndex(student => {
      if (student.id == opts.id) return true;
    });
    this.students[index].notes = opts.notes;
    this.unfilteredStudents[index].notes = opts.notes;
  }

  /**
   *
   * @param {ICalendar} opts
   * Will get all Students queried by today's date.
   */
  getStudentsRecords(opts: ICalendar) {
    const date = { ...opts, month: opts.month + 1 };
    try {
      const response = this.db.getStudentsRecordsByDate({ date: date, event: this.event });
      if (response.success == true) {
        this.students = [...response.data];
        this.unfilteredStudents = [...response.data];
      } else {
        handleError(response.error);
      }
    } catch (error) {
      handleError(error);
    }
  }

  /**
   *
   * @param date
   */
  getDate(date: ICalendar) {
    this.search = '';
    this.date = date;
    const currentDay = date.day;
    const currentMonth = MONTHSLABELS[date.month];
    const currentYear = date.year;
    const currentWeekDay = WEEKDAYSHEADER[date.weekDay];
    this.currentDate = `${currentWeekDay}, ${currentDay} ${currentMonth}, ${currentYear}`;
    this.getStudentsRecords(date);
  }

  addAttendance(opts: { id: string }) {
    const response = this.db.addAttendance({ event: this.event, date: this.date, id: opts.id });
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
      handleError(response.error);
    }
  }

  addAbsence(opts: { id: string }) {
    const response = this.db.addAbsence({ event: this.event, date: this.date, id: opts.id });
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

  private updateStudentAttendance(opts: { id: string; absence: boolean; attendance: boolean }) {
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
    this.unfilteredStudents = [...results];
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl
      .create({
        title: options.title,
        subTitle: options.subTitle,
        buttons: options.buttons
      })
      .present();
  }

  searchStudent() {
    let query = this.search;
    query ? this.filterStudentsList(query) : this.initializeStudentsList();
  }

  private initializeStudentsList() {
    this.students = [...this.unfilteredStudents];
  }

  private filterStudentsList(query: string) {
    const students = <any>this.unfilteredStudents;
    this.students = <any>filterStudentsList({ query: query, students: students });
  }

  goBack() {
    this.viewCtrl.dismiss();
  }
}
