import { StudentListPage } from './../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MainPage } from '../../pages/main/main';
import { TablePage } from '../../pages/table/table';
import {CalendarPage} from '../../pages/calendar/calendar';
import {SettingsPage} from '../../pages/settings/settings';


@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
  <ion-tabs>
     <ion-tab tabIcon="home" [root]="tab1"></ion-tab>
     <ion-tab tabIcon="calendar" [root]="tab2"></ion-tab>     
     <ion-tab tabIcon="stats" [root]="tab3"></ion-tab>
     <ion-tab tabIcon="people" [root]="tab4"></ion-tab>     
     <ion-tab tabIcon="cog" [root]="tab5"></ion-tab> 
  </ion-tabs>
`
})
export class TabsPage {

  constructor() { }

  tab1 = MainPage;
  tab2=CalendarPage;
  tab3 = TablePage;
  tab4 = StudentListPage;
  tab5 = SettingsPage;
}
