import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IEvent } from '../../common/interface';
import { handleError } from '../../common/handleError';

/**
 * Generated class for the EventProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-profile',
  templateUrl: 'event-profile.html',
})
export class EventProfilePage implements OnInit {

  /**
   * This is the data show on the Page
   */
  eventProfile;
  /**
   * This is the data that is to be used for CRUD
   */
  event: IEvent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AmaranthusDBProvider
  ) {
  }

  ngOnInit() {
    this.eventProfile = {};
    this.event = <IEvent>{};
  }

  ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.getEventProfile(id);
  }

  getEventProfile(id) {
    const response = this.db.getEventProfile(id);
    if (response.success) {
      this.event = { ...response.data };
      let members = [];
      for (const member of response.data.members) {
        const studentResponse = this.db.getStudentById(<any>member);
        if (studentResponse.success) {
          members = [...members, {
            id: studentResponse.data.id,
            firstName: studentResponse.data.firstName,
            initial: studentResponse.data.initial,
            lastName: studentResponse.data.lastName,
            phoneNumber: studentResponse.data.phoneNumber,
            picture: studentResponse.data.picture,
            class: studentResponse.data.class,
            attendance: member.attendance,
            absence: member.absence
          }];
        }
      }
      this.eventProfile = {
        ...response.data,
        members: [...members]
      }
    }
    else handleError(response.error);
  }

  addAttendance(id) {
    const index = this.event.members.findIndex(member => member.id == id);
    this.eventProfile.members[index].attendance = true;
    this.eventProfile.members[index].absence = false;
    //TODO: Update db to reflect attendance added using this.event.$loki on db
  }

  addAbsence(id) {
    const index = this.event.members.findIndex(member => member.id == id);
    this.eventProfile.members[index].attendance = false;
    this.eventProfile.members[index].absence = true;
    //TODO: Update db to reflect absence added using this.event.$loki on db
  }

  editEvent(){
    //TODO: Add edit page and DELETE method
  }

}
