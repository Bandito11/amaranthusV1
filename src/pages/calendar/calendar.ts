import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Calendar, IRecord, ISimpleAlertOptions } from '../../common/interface';
import { monthsLabels, weekDaysHeader } from '../../common/labels';
import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit {

  constructor(
    public alertCtrl: AlertController,
    public db: AmaranthusDBProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  currentDate: string;
  students: IRecord[];
  private untouchedStudentList: IRecord[];
  private date: Calendar;

  ionViewWillEnter(){
    this.getStudentsRecords(this.date);
  }
  
  ngOnInit() {
    this.students = [];
    this.untouchedStudentList = [];
  }

  getStudentsRecords(opts: Calendar) {
    // Will get all Students queried by today's date.
    const date = { ...opts, month: opts.month + 1 }
    this.db.getStudentsRecordsByDate(date)
      .then(response => {
        if (response.success == true) {
          this.students = [...response.data];
          this.untouchedStudentList = [...response.data];
        }else{
          handleError(response.error);
        }
      })
      .catch(error => handleError(error))
  }

  getDate(date: Calendar) {
    this.date = date;
    const currentDay = date.day;
    const currentMonth = monthsLabels[date.month];
    const currentYear = date.year;
    const currentWeekDay = weekDaysHeader[date.weekDay];
    this.currentDate = `${currentWeekDay}, ${currentDay} ${currentMonth}, ${currentYear}`;
    this.getStudentsRecords(date);
  }

  addAttendance(opts: { id: string }) {
    this.db.addAttendance({ date: this.date, id: opts.id })
      .then(response => {
        if (response.success == true) {
          this.updateStudentAttendance({ id: opts.id, absence: false, attendance: true });
          this.showSimpleAlert({
            title: 'Success!',
            subTitle: 'Student was marked present!',
            buttons:['OK']
          });
        } else {
          handleError(response.error)
        }
      })
      .catch(error => handleError(error));
  }

  updateStudentAttendance(opts: { id: string, absence: boolean, attendance: boolean }) {
    const results = this.students.map(student => {
      if (student.id == opts.id) {
        return { ...student, attendance: opts.attendance, absence: opts.absence };
      } else {
        return student;
      }
    });
    this.students = [...results];
    this.untouchedStudentList = [...results];
  }
  
  addAbsence(opts: { id: string }) {
    this.db.addAbsence({ date: this.date, id: opts.id })
      .then(response => {
        if (response.success == true) {
          this.updateStudentAttendance({ id: opts.id, absence: true, attendance: false });
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
