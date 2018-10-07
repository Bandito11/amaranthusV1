import { MONTHSLABELS } from './../../../common/constants';
import { TableEventsPage } from './../table/table-events';
import { CalendarEventsPage } from './../calendar/calendar-events';
import { IEvent, ISimpleAlertOptions } from '../../../common/models';
import { EditEventPage } from './../editevent/editevent';
import { AmaranthusDBProvider } from './../../../providers/amaranthus-db/amaranthus-db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { handleError } from '../../../common/handleError';
import { formatDate } from '../../../common/formatToText';

interface eventControls {
  members;
  endDate;
  startDate;
}

@IonicPage()
@Component({
  selector: 'page-event-profile',
  templateUrl: 'event-profile.html'
})
export class EventProfilePage {
  /**
   * This is the data show on the Page
   */
  eventControls: IEvent & LokiObj & eventControls = <IEvent & LokiObj & eventControls>{};
  /**
   * This is the data that is to be used for CRUD
   */
  event: IEvent & LokiObj = <IEvent & LokiObj>{};

  id;

  currentDate: string;

  infiniteDate: boolean;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public db: AmaranthusDBProvider, public alertCtrl: AlertController, public modal: ModalController) {}

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.getEventProfile(this.id);
    const date = new Date();
    this.currentDate = `${MONTHSLABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  getEventProfile(id) {
    const date = new Date();
    const response = this.db.getEvent(id);
    if (response.success) {
      this.event = { ...response.data };
      let members = [];
      for (const member of response.data.members) {
        const studentResponse = this.db.getStudentById(<any>member);
        if (studentResponse.success) {
          if (this.event.infiniteDates) {
            let record = this.db.getQueriedRecordsByCurrentDate({
              event: this.event.name,
              studentId: studentResponse.data.id,
              day: date.getDate(),
              month: date.getMonth() + 1,
              year: date.getFullYear()
            });
            if (!record) {
              record = {
                id: '',
                year: 0,
                month: 0,
                day: 0,
                attendance: false,
                absence: false
              };
            }
            members = [
              ...members,
              {
                id: studentResponse.data.id,
                firstName: studentResponse.data.firstName,
                initial: studentResponse.data.initial,
                lastName: studentResponse.data.lastName,
                phoneNumber: studentResponse.data.phoneNumber,
                picture: studentResponse.data.picture,
                class: studentResponse.data.class,
                attendance: member.attendance,
                absence: member.absence,
                record: record
              }
            ];
          } else {
            members = [
              ...members,
              {
                id: studentResponse.data.id,
                firstName: studentResponse.data.firstName,
                initial: studentResponse.data.initial,
                lastName: studentResponse.data.lastName,
                phoneNumber: studentResponse.data.phoneNumber,
                picture: studentResponse.data.picture,
                class: studentResponse.data.class,
                attendance: member.attendance,
                absence: member.absence
              }
            ];
          }
        }
      }
      this.eventControls = {
        ...response.data,
        startDate: formatDate(response.data.startDate),
        members: [...members]
      };
      if (response.data.endDate) {
        this.eventControls = {
          ...this.eventControls,
          endDate: formatDate(response.data.endDate)
        };
      }
    } else handleError(response.error);
  }

  addAttendance(id) {
    const index = this.event.members.findIndex(member => member.id == id);
    if (this.event.infiniteDates) {
      this.eventControls.members[index].record.attendance = true;
      this.eventControls.members[index].record.absence = false;
    } else {
      this.eventControls.members[index].attendance = true;
      this.eventControls.members[index].absence = false;
    }
    this.updateAttendance({ index: index, attendance: true, absence: false });
  }

  addAbsence(id) {
    const index = this.event.members.findIndex(member => member.id == id);
    if (this.event.infiniteDates) {
      this.eventControls.members[index].record.attendance = false;
      this.eventControls.members[index].record.absence = true;
    } else {
      this.eventControls.members[index].attendance = false;
      this.eventControls.members[index].absence = true;
    }
    this.updateAttendance({ index: index, attendance: false, absence: true });
  }

  updateAttendance(member: { index: number; attendance: boolean; absence: boolean }) {
    if (this.event.infiniteDates) {
      //TODO: Make an attendance method
      // const date = new Date();
      const currentDate = {
        month: new Date().getMonth(),
        day: new Date().getDate(),
        year: new Date().getFullYear()
      };
      this.db.insertOrUpdateRecord({
        id: this.event.members[member.index].id,
        attendance: member.attendance,
        absence: member.absence,
        date: currentDate,
        event: this.event.name
      });
    } else {
      this.event.members[member.index].attendance = member.attendance;
      this.event.members[member.index].absence = member.absence;
    }
    try {
      const response = this.db.updateEvent(this.event);
      if (!response.success) {
        const opts = {
          title: 'Error!',
          subTitle: 'Attendance was not updated due to an unknown error. Please try again'
        };
        this.showSimpleAlert(opts);
      }
    } catch (error) {
      const opts = {
        title: 'Error!',
        subTitle: error
      };
      this.showSimpleAlert(opts);
    }
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

  editEvent() {
    const modal = this.modal.create(EditEventPage, { id: this.id });
    modal.onDidDismiss(data => (data ? this.getEventProfile(data) : this.navCtrl.pop()));
    modal.present();
  }

  goToCalendar() {
    const modal = this.modal.create(CalendarEventsPage, { event: this.event.name });
    modal.onDidDismiss(_ => {
      this.getEventProfile(this.id);
    });
    modal.present();
  }

  goToTable() {
    const modal = this.modal.create(TableEventsPage, { event: this.event });
    // modal.onDidDismiss(_ => {
    //   this.getEventProfile(this.id);
    // });
    modal.present();
  }

}
