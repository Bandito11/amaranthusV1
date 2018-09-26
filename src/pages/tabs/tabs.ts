import { StudentListPage } from '../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MainPage } from '../main/main';
import { TablePage } from '../table/table';
import { CalendarPage } from '../calendar/calendar';
import { SettingsPage } from '../settings/settings';


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

// <ion-tab tabIcon="cog" [root]="tab5"></ion-tab> 

export class TabsPage {

  tab1 = MainPage;
  tab2 = CalendarPage;
  tab3 = TablePage;
  tab4 = StudentListPage;
  tab5 = SettingsPage;

  constructor() { }
}
