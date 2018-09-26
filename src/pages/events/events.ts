import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { CreateEventPage } from '../createevent/createevent';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { formatDate } from '../../common/formatToText';
import { EventProfilePage } from '../event-profile/event-profile';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  selectOptions: string[] = ['Attendance', 'Absence', 'Name', 'Date', 'None'];
  events: any[] = [];
  unfilteredEvents: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AmaranthusDBProvider,
    public modal: ModalController
  ) { }

  ionViewDidEnter() {
    this.getEvents();
  }

  sortData(option) {
    switch (option) {
      case 'Attendance':
        this.sortByAttendance();
        break;
      case 'Absence':
        this.sortByAbsence();
        break;
      case 'Name':
        this.sortByName();
        break;
      case 'Date':
        this.sortByDate();
        break;
      default:
        this.events = [...this.unfilteredEvents];
    }
  }

  sortByAttendance() {
    this.events = [
      ...this.events.sort((a, b) => {
        if (a.attendance < b.attendance) return -1;
        if (a.attendance > b.attendance) return 1;
        return 0;
      })
    ];
  }

  sortByAbsence() {
    this.events = [
      ...this.events.sort((a, b) => {
        if (a.absence < b.absence) return -1;
        if (a.absence > b.absence) return 1;
        return 0;
      })
    ];

  }

  sortByName() {
    this.events = [
      ...this.events.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      })
    ];
  }

  sortByDate() {
    this.events = [
      ...this.events.sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        if (a.startDate > b.startDate) return 1;
        return 0;
      })
    ];
  }

  getEvents() {
    const response = this.db.getEvents();
    if (response.success) {
      this.events = response.data.map(data => {
        let attendance: number = 0, absence: number = 0;
        for (const member of data.members) {
          if (member.attendance) attendance += 1;
          if (member.absence) absence += 1;
        }
        let event: any = {
          ...data,
          startDate: formatDate(data.startDate),
          totalMembers: data.members.length,
          totalAttendance: attendance,
          totalAbsence: absence
        }
        if (data.endDate) {
          event = {
            ...event,
            endDate: formatDate(data.endDate)
          }
        }
        return event;
      });
      this.unfilteredEvents = [...this.events];
    }
  }

  goToCreateEvent() {
    const modal = this.modal.create(CreateEventPage)
    modal.onDidDismiss(_ => this.getEvents())
    modal.present();
  }

  goToEventProfile(id: string) {
    this.navCtrl.push(EventProfilePage, { id: id });
  }

}
