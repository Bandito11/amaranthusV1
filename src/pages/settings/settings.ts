import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { LogFileProvider } from '../../providers/log-file/log-file';
import { DropboxProvider } from '../../providers/dropbox/dropbox';

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
    // private logFile: LogFileProvider,
    dropbox: DropboxProvider
  ) {  }

  // products: IAPProduct[];
  // owned: boolean;
  fileName: string;
  ionViewDidLoad() { }

  exportFileToDropbox() {
    
    
  }

  // purchaseProduct(product: IAPProduct) { };

}
