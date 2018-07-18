import { stateAndroid } from './../../common/app-purchase';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { IonicPage, Platform, LoadingController, AlertController } from 'ionic-angular';
import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
import { ISimpleAlertOptions } from '../../common/interface';
import { productGet } from '../../common/app-purchase';
import { EmailComposer } from '@ionic-native/email-composer';

@IonicPage()
@Component({ selector: 'page-settings', templateUrl: 'settings.html' })

export class SettingsPage implements OnInit {

  constructor(
    private emailComposer: EmailComposer, 
    private loading: LoadingController, 
    private storage: Storage, 
    private platform: Platform, 
    private iap: AppPurchaseProvider, 
    private alertCtrl: AlertController
   ) { }


  private products: productGet[];
  private noProducts: boolean;
  private isIos: boolean;
  private isAndroid: boolean;
  private bought: boolean;

  ngOnInit() {
    this.products = [];
    this.noProducts = true;
    if (this.platform.is('ios')) {
      this.isIos = true;
    } else if (this.platform.is('android')) {
      this.isAndroid = true;
    }
  }
  ionViewWillLoad() {
    this.storage.get('boughtMasterKey')
      .then(boughtMasterKey => {
        if (boughtMasterKey) {
          this.bought = true;
        } else {
          this.bought = false;
        }
      });
  }
  ionViewWillEnter() {
    if (!this.platform.is('core')) this.getProducts();
  }

  sendEmail(message: string) {
    let email = {
      to: 'bandito-dev@outlook.com',
      subject: 'Attendance Log: Browser',
      body: message,
      isHtml: true
    };
    if (!this.platform.is('core')) {
      this.emailComposer.isAvailable().then(available => {
        if (available) {
          if (this.platform.is('android')) {
            email = {
              ...email,
              subject: 'Attendance Log: Android'
            };
          }
          if (this.platform.is('ios')) {
            email = {
              ...email,
              subject: 'Attendance Log: IPhone'
            };
          }
          // Send a text message using default options
          this.emailComposer.open(email);
        }
      });
    } else {
      this.emailComposer.open(email);
    }
  }

  createEmail(message: string) {
    let email = {
      to: 'bandito-dev@outlook.com',
      subject: 'Attendance Log: Browser',
      body: message,
      isHtml: true
    };
    return email;
  }

  getProducts() {
    this.iap.getProducts()
      .then(products => {
        this.noProducts = false;
        this.products = [...products]
      })
      .catch(err => this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: err }));
  }

  restorePurchases() {
    const loading = this.loading.create({ content: 'Restoring Purchases!' });
    loading.present();
    this.iap.restore()
      .then(products => {
        products.forEach(product => {
          if (this.platform.is('ios')) {
            if (product.productId == 'master.key') {
              this.storage.set('boughtMasterKey', true);
              this.bought = true;
              const options: ISimpleAlertOptions = {
                title: 'Information',
                subTitle: 'Restored the purchase!'
              };
              this.showSimpleAlert(options);
            }
            loading.dismiss();
          } else if (this.platform.is('android')) {
            const receipt = JSON.parse(product.receipt);
            if (product.productId == 'master.key' && stateAndroid[receipt.purchaseState] == ('ACTIVE' || 0)) {
              this.storage.set('boughtMasterKey', true);
              const options: ISimpleAlertOptions = {
                title: 'Information',
                subTitle: 'Restored the purchase!'
              };
              this.showSimpleAlert(options);
            }
            loading.dismiss();
          }
        });
      })
      .catch(err => {
        this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: err })
        loading.dismiss();
      });
  }

  buyProduct(opts: {
    productTitle: string,
    productId: string
  }) {
    const loading = this.loading.create({ content: `Buying ${opts.productTitle}!` });
    loading.present();
    this.iap.buy(opts.productId)
      .then(product => {
        this.showSimpleAlert({ buttons: ['OK'], title: 'Success!', subTitle: `${product.transactionId} was successfully bought.` });
        this.storage.set('boughtMasterKey', true);
        loading.dismiss();
      })
      .catch(err => {
        this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: err })
        loading.dismiss();
      });
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({ title: options.title, subTitle: options.subTitle, buttons: options.buttons })
      .present();
  }

}
