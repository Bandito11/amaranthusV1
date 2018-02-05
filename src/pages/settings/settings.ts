import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { LogFileProvider } from '../../providers/log-file/log-file';
import { DropboxProvider } from '../../providers/dropbox/dropbox';
import { Table2excelProvider } from '../../providers/table2excel/table2excel';
import { SecurityContext } from '@angular/compiler/src/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
    private dropbox: DropboxProvider,
    private table2Excel: Table2excelProvider,
    private sanitizer: DomSanitizer,
    private iab: InAppBrowser
  ) { }

  // products: IAPProduct[];
  // owned: boolean;
  fileName: string;
  ionViewDidLoad() { }

  exportFileToDropbox() {


  }
  href: any;
  // purchaseProduct(product: IAPProduct) { };

  exportToFile() {
    this.href = this.sanitizer.bypassSecurityTrustUrl(this.table2Excel.exportSpreadSheetToFile());
    const browser = this.iab.create(this.table2Excel.exportSpreadSheetToFile(), '_blank');
    browser.show();
    console.log(this.table2Excel.exportSpreadSheetToFile())
  }
}
