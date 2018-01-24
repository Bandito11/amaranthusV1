import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private store: AppPurchaseProvider
  ) {
  }

  products: IAPProduct[];
  owned: boolean;

  ionViewDidLoad() {
    this.products = [];
    this.store.listIAPProduct()
      .then(res => {
        if (res.success) {
          this.products = [...res.data];
        }
      });

  }

  purchaseProduct(product: IAPProduct) { };

}
