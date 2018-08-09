import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { CreateEventPage } from '../createevent/createevent';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { formatDate } from '../../common/formatToText';
import { EventProfilePage } from '../event-profile/event-profile';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AmaranthusDBProvider,
    public modal: ModalController
  ) { }

  selectOptions: string[];
  events: any[];
  untouchedEvents: any[];

  ngOnInit() {
    this.selectOptions = ['Attendance', 'Absence', 'Event', 'Date'];
  }

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
      case 'Event':
        this.sortByEvents();
        break;
      case 'Date':
        this.sortByDate();
        break;
      default:
        this.events = [...this.untouchedEvents];
    }
  }

  sortByAttendance() { }

  sortByAbsence() { }

  sortByEvents() { }

  sortByDate() { }

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
    }
  }

  goToCreateEvent() {
    this.modal.create(CreateEventPage).present();
  }

  goToEventProfile(id: string) {
    this.navCtrl.push(EventProfilePage, { id: id });
  }

}