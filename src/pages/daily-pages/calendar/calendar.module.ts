import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    CalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarPage),
    ComponentsModule
  ]
})
export class CalendarPageModule { }
