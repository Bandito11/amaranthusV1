import { StudentListPage } from './../student-list/student-list';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MainPage } from '../../pages/main/main';
import { TablePage } from '../../pages/table/table';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
  <ion-tabs>
     <ion-tab tabTitle="Active Students" [root]="tab1"></ion-tab>
     <ion-tab tabTitle="Table" [root]="tab2"></ion-tab>
     <ion-tab tabTitle="All Students" [root]="tab3"></ion-tab>     
  </ion-tabs>
`
})
export class TabsPage {

  constructor() { }

  tab1 = MainPage;
  tab2 = TablePage;
  tab3 = StudentListPage;
}
