import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
     <ion-tab tabTitle="Main" [root]="tab1"></ion-tab>
     <ion-tab tabTitle="Table" [root]="tab2"></ion-tab>
  </ion-tabs>
`
})
export class TabsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  tab1 = MainPage;
  tab2 = TablePage;
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
