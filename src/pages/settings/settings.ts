import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { TextTabDelimitedProvider } from '../../providers/text-tab-delimited/text-tab-delimited';
// import { DomSanitizer } from '@angular/platform-browser';
import { ISimpleAlertOptions } from '../../common/interface';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { CSVProvider } from '../../providers/csv/csv';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    // private store: AppPurchaseProvider,
    private textTabDelimited: TextTabDelimitedProvider,
    // private sanitizer: DomSanitizer,
    private alertCtrl: AlertController,
    private csv: CSVProvider
  ) { }

  // products: IAPProduct[];
  // owned: boolean;
  fileName: string;
  ionViewDidLoad() { }

  exportFileToDropbox() {


  }
  href: any;
  // purchaseProduct(product: IAPProduct) { };

  async exportToFile() {
    
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
