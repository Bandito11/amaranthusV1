import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
// import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { TextTabDelimitedProvider } from '../../providers/text-tab-delimited/text-tab-delimited';
import { DropboxProvider } from '../../providers/dropbox/dropbox';
import { Table2excelProvider } from '../../providers/table2excel/table2excel';
// import { DomSanitizer } from '@angular/platform-browser';
import { ISimpleAlertOptions } from '../../common/interface';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
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
    private csv: TextTabDelimitedProvider,
    private dropbox: DropboxProvider,
    private table2Excel: Table2excelProvider,
    // private sanitizer: DomSanitizer,
    private alertCtrl: AlertController
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
    // this.href = this.sanitizer.bypassSecurityTrustUrl(this.table2Excel.exportSpreadSheetToFile());
    let message;
    try {
      message = await this.csv.exportTextTabDelimited();
      this.showSimpleAlert({ title: 'Information', subTitle: message });
    } catch (error) {
      for (let prop in error) {
        if (prop != undefined)
          console.log(`${error[prop]}`);
      }
    }
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
