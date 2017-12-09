import { StudentListPage } from './../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MainPage } from '../../pages/main/main';
import { TablePage } from '../../pages/table/table';


@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
  <ion-tabs>
     <ion-tab tabTitle="Active Roster" [root]="tab1"></ion-tab>
     <ion-tab tabTitle="Table" [root]="tab2"></ion-tab>
     <ion-tab tabTitle="Whole Roster" [root]="tab3"></ion-tab>     
  </ion-tabs>
`
})
export class TabsPage {

  constructor() { }

  tab1 = MainPage;
  tab2 = TablePage;
  tab3 = StudentListPage;
}
