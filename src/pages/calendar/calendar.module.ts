import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar';
import { CalendarComponent } from '../../components/calendar/calendar';

@NgModule({
  declarations: [
    CalendarPage,
    CalendarComponent
  ],
  imports: [
    IonicPageModule.forChild(CalendarPage),
  ],
})
export class CalendarPageModule { }
