import {Component, OnInit} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AppPurchaseProvider} from '../../providers/app-purchase/app-purchase';
import {ISimpleAlertOptions} from '../../common/interface';
import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {productGet} from '../../common/app-purchase';

@IonicPage()
@Component({selector: 'page-settings', templateUrl: 'settings.html'})

export class SettingsPage implements OnInit {

  private products : productGet[];
  private noProducts : boolean;
  
  constructor(private iap : AppPurchaseProvider, private alertCtrl : AlertController,) {}

  ngOnInit() {
    this.products = [];
    this.noProducts = true;
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  getProducts() {
    this
      .iap
      .getProducts()
      .then(products => {
        this.noProducts = false;
        this.products = [...products]
      })
      .catch(err => this.showSimpleAlert({buttons: ['OK'], title: 'Error!', subTitle: err}));
  }

  buyProduct(productId : string) {
    this
      .iap
      .buy(productId)
      .then(product => {
        this.showSimpleAlert({buttons: ['OK'], title: 'Success!', subTitle: `${product.transactionId} was successfully bought.`})
      })
      .catch(err => this.showSimpleAlert({buttons: ['OK'], title: 'Error!', subTitle: err}));
  }

  private showSimpleAlert(options : ISimpleAlertOptions) {
    return this
      .alertCtrl
      .create({title: options.title, subTitle: options.subTitle, buttons: options.buttons})
      .present();;
  }

}
