import { StudentListPage } from './../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MainPage } from '../../pages/main/main';
import { TablePage } from '../../pages/table/table';
import {CalendarPage} from '../../pages/calendar/calendar';

@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
  <ion-tabs>
     <ion-tab tabTitle="Main" [root]="tab1"></ion-tab>
     <ion-tab tabTitle="Calendar" [root]="tab4"></ion-tab>     
     <ion-tab tabTitle="Table" [root]="tab2"></ion-tab>
     <ion-tab tabTitle="Roster" [root]="tab3"></ion-tab>     
  </ion-tabs>
`
})
export class TabsPage {

  constructor() { }

  tab1 = MainPage;
  tab2 = TablePage;
  tab3 = StudentListPage;
  tab4=CalendarPage;
}
