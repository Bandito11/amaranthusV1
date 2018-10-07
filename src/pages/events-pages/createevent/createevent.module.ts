import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateEventPage } from './createevent';

@NgModule({
  declarations: [
    CreateEventPage
  ],
  imports: [
    IonicPageModule.forChild(CreateEventPage),
  ],
})
export class CreateEventPageModule {}
