import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventProfilePage } from './event-profile';

@NgModule({
  declarations: [
    EventProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EventProfilePage),
  ],
})
export class EventProfilePageModule {}
