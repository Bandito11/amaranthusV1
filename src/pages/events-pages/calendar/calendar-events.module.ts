import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarEventsPage } from './calendar-events';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    CalendarEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarEventsPage),
    ComponentsModule
  ]
})
export class CalendarEventsPageModule { }
