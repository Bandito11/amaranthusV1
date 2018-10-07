import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEventPage } from './editevent';

@NgModule({
  declarations: [
    EditEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEventPage),
  ],
})
export class EditEventPageModule {}
