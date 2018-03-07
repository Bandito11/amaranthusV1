import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { DomSanitizer } from '@angular/platform-browser';
import { ISimpleAlertOptions } from '../../common/interface';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

enum stateAndroid {
  ACTIVE,
  CANCELLED,
  REFUNDED
}

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private iap: AppPurchaseProvider,
    // private sanitizer: DomSanitizer,
    private alertCtrl: AlertController,
  ) { }

  ionViewDidLoad() {
    this.products = [];
    this.iap.getProducts()
      .then(products => this.products = products)
      .catch(err => console.log(err))
    let productInterval = setInterval(() => {
      if (this.products.length > -1) {
        clearInterval(productInterval);
      }
    }, 500);
  }

  products;

  buyProduct(productId) {
    this.iap.buy(productId);
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
