import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentProfilePage } from './student-profile';

@NgModule({
  declarations: [
    StudentProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(StudentProfilePage),
  ],
})
export class StudentProfilePageModule {}
