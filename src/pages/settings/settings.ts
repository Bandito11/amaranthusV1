import { stateAndroid } from '../../common/app-purchase';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, Platform, LoadingController, AlertController } from 'ionic-angular';
import { AppPurchaseProvider } from '../../providers/app-purchase/app-purchase';
import { ISimpleAlertOptions } from '../../common/models';
import { productGet } from '../../common/models';
import { EmailComposer } from '@ionic-native/email-composer';
import { Market } from '@ionic-native/market';

@IonicPage()
@Component({ selector: 'page-settings', templateUrl: 'settings.html' })

export class SettingsPage {
  private products: productGet[] = [];
  private noProducts: boolean = true;
  private isIos: boolean;
  private isAndroid: boolean;
  private bought: boolean;

  constructor(
    private emailComposer: EmailComposer,
    private loading: LoadingController,
    private storage: Storage,
    private platform: Platform,
    private iap: AppPurchaseProvider,
    private alertCtrl: AlertController,
    private market: Market
  ) { }

  ionViewWillLoad() {
    if (this.platform.is('ios')) {
      this.isIos = true;
    } else if (this.platform.is('android')) {
      this.isAndroid = true;
    }
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
    if (this.platform.is('cordova')) {
      this.storage.get('products')
        .then(products => {
          if (products) {
            this.products = products;
            this.noProducts = false;
          } else {
            this.getProducts;
          }
        });
    }
  }

  openMarketPage() {
    if (this.platform.is('android')) {
      this.market.open('xyz.attendancelog.amaranthus');
    }
    if (this.platform.is('ios')) {
      this.market.open('id1366019347');
    }
  }

  sendEmail(message: string) {
    const body = `
    Hi,
    For issues:
    [Phone Model]
    Issue: [Write a summary of my issue!]

    For Feedback:
    [Phone Model]
    Idea: [Summary of my awesome idea!]
    Description: ${message}
    `;
    let email = {
      to: 'attendancelogtracker@gmail.com',
      subject: 'Attendance Log: Browser',
      body: body
    };
    if (this.platform.is('cordova')) {
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
    }
    this.emailComposer.open(email);
  }

  getProducts() {
    this.iap.getProducts()
      .then(products => {
        this.noProducts = false;
        this.products = [...products];
        this.storage.set('products', products);
      })
      .catch(err => this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: err }));
  }

  restorePurchases() {
    const loading = this.loading.create({ content: 'Restoring Purchases!' });
    loading.present();
    if (this.platform.is('android')) {
      this.iap.restoreAndroidPurchase()
        .then(products => {
          products.forEach(product => {
            const receipt = JSON.parse(product.receipt);
            if (product.productId == 'master.key' && stateAndroid[receipt.purchaseState] == ('ACTIVE' || 0)) {
              this.storage.set('boughtMasterKey', true);
              this.bought = true;
              const options: ISimpleAlertOptions = {
                title: 'Information',
                subTitle: 'Restored the purchase!',
                buttons: ['OK']
              };
              this.showSimpleAlert(options);
            }
          });
          loading.dismiss();
        })
        .catch(_ => {
          this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: `No receipts available in the App Store!` })
          loading.dismiss();
        });
    } else if (this.platform.is('ios')) {
      this.iap.restoreiOSPurchase()
        .then(receipt => {
          if (receipt) {
            const options: ISimpleAlertOptions = {
              title: 'Information',
              subTitle: 'Restored the purchase!',
              buttons: ['OK']
            };
            this.storage.set('boughtMasterKey', true);
            this.bought = true;
            this.showSimpleAlert(options);
            loading.dismiss();
          } else {
            const options: ISimpleAlertOptions = {
              title: 'Information',
              subTitle: `No receipts available in the App Store!`,
              buttons: ['OK']
            };
            this.showSimpleAlert(options);
          }
        })
        .catch(error => {
          this.showSimpleAlert({ buttons: ['OK'], title: 'Error!', subTitle: 'No receipts available in the App Store!' })
          loading.dismiss();
        });
    }
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
        this.bought = true;
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
