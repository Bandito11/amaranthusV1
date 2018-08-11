import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { CreateEventPageModule } from '../createevent/createevent.module';
import { EventProfilePageModule } from '../event-profile/event-profile.module';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    CreateEventPageModule,
    EventProfilePageModule
  ],
})
export class EventsPageModule {}
