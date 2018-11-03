import { StudentListPage } from '../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { MainPage } from '../daily-pages/main/main';
import { TablePage } from '../daily-pages//table/table';
import { CalendarPage } from '../daily-pages/calendar/calendar';
import { SettingsPage } from '../settings/settings';
import { ClientLoginPage } from '../clientlogin/clientlogin';

@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
  <ion-tabs>
     <ion-tab tabIcon="home" [root]="tab1"></ion-tab>
     <ion-tab tabIcon="calendar" [root]="tab2"></ion-tab>     
     <ion-tab tabIcon="stats" [root]="tab3"></ion-tab>
     <ion-tab tabIcon="people" [root]="tab4"></ion-tab>
     <div *ngIf="this.platform.is('ipad')">
     <ion-tab tabIcon="log-in" [root]="tab6"></ion-tab>
     </div>
     <ion-tab tabIcon="cog" [root]="tab5"></ion-tab>
     <!--
     <ion-tab tabIcon="log-in" [root]="tab6"></ion-tab>
     -->
  </ion-tabs>
`
})
export class TabsPage {
  tab1 = MainPage;
  tab2 = CalendarPage;
  tab3 = TablePage;
  tab4 = StudentListPage;
  tab5 = SettingsPage;
  tab6 = ClientLoginPage;

  constructor(public platform: Platform) {}
}
