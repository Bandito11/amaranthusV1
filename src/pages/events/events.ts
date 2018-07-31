import { CreateEventPage } from '../createevent/createevent';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  selectOptions: string[];
  events: any[];
  untouchedEvents: any[];

  ngOnInit() {
    this.selectOptions = ['Attendance', 'Absence', 'Event', 'Date'];
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    this.getEvents();
  }

  sortData(option) {
    switch (option) {
      case 'Attendance':
        break;
      case 'Absence':
        break;
      case 'Event':
        break;
      case 'Date':
        break;
      default:
        this.events = [...this.untouchedEvents];
    }
  }

  sortByAttendance(){}
  
  sortByAbsence(){}

  sortByEvents(){}

  sortByDate(){}

  getEvents() {
    this.events = [...mockEvents];
  }

  goToCreateEvent() {
    this.navCtrl.push(CreateEventPage);
  }

}

const mockEvents = [{
  img: 'https://firebasestorage.googleapis.com/v0/b/ageratum-ec8a3.appspot.com/o/Node.js_logo.png?alt=media&token=fce4e44e-ddc6-490e-ba83-d3080cb3d59b',
  name: 'Default Event Name',
  date: '07/30/2018',
  totalMembers: '10',
  totalAttendance: '8 | 80%',
  totalAbsence: '2 | 20%'
}]