import { TableEventsPageModule } from './../table/table-events.module';
import { EditEventPageModule } from './../editevent/editevent.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventProfilePage } from './event-profile';
import { CalendarEventsPageModule } from '../calendar/calendar-events.module';

@NgModule({
  declarations: [
    EventProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EventProfilePage),
    EditEventPageModule,
    TableEventsPageModule,
    CalendarEventsPageModule
  ],
})
export class EventProfilePageModule {}
