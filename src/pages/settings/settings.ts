import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
import { ISimpleAlertOptions } from '../../common/interface';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { productRestore, productGet } from '../../common/app-purchase';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  private products: productGet[];
  private purchasedProducts: productRestore[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private iap: AppPurchaseProvider,
    private alertCtrl: AlertController,
  ) { }

  ionViewDidLoad() {
    this.getProducts();
  }

  getProducts() {
    this.iap.getProducts()
      .then(products => this.products = products)
      .catch(err => this.showSimpleAlert({ title: 'Success!', subTitle: err }));
    let productInterval = setInterval(() => {
      if (this.products.length > -1) {
        clearInterval(productInterval);
      }
    }, 500);
  }

  buyProduct(productId) {
    this.iap.buy(productId)
      .then(product => {
        this.showSimpleAlert({ title: 'Success!', subTitle: `${product.transactionId} was successfully bought.` })
      })
      .catch(err => this.showSimpleAlert({ title: 'Error!', subTitle: err }));
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }

}
