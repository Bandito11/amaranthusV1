import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { LogFileProvider } from '../../providers/log-file/log-file';

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
    private logFile: LogFileProvider
  ) {  }

  // products: IAPProduct[];
  // owned: boolean;
  fileName: string;
  ionViewDidLoad() { }

  exportFile() {
    this.logFile.exportFile()
      .then(file => {
        this.fileName = file;
      })
      .catch(error => {
        for(let prop in error){
          console.log(error[prop])
        }
      });
  }

  // purchaseProduct(product: IAPProduct) { };

}
