import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentProfilePage } from './student-profile';
import { EditPageModule } from '../edit/edit.module';

@NgModule({
  declarations: [
    StudentProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(StudentProfilePage),
    EditPageModule
  ],
})
export class StudentProfilePageModule {}
