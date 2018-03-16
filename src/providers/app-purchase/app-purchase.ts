import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { productRestore, productGet, productBought } from '../../common/app-purchase';

@Injectable()
export class AppPurchaseProvider {

  constructor(private iap: InAppPurchase) {
  }

  handleError(err) {
    let message = "";
    try {
    for (let prop in err) {
      try {
        message += `${err[prop]}\n`;
      } catch (error) { }
    }
    } catch (error) {
      message = err;
    }
    return message;
  }

  /**
   * Restore purchase
   */
  restore(): Promise<productRestore[]> {
    return new Promise((resolve, reject) => {
      this.iap.restorePurchases()
        .then(purchased => resolve(purchased))
        .catch(err => {
          const message = this.handleError(err);
          reject(message);
        });
    });
  }
  /**
   * Buy Product
   */
  buy(productId): Promise<productBought> {
    return new Promise((resolve, reject) => {
      this.iap.buy(productId)
        .then(product => resolve(product))
        .catch(err => {
          const message = this.handleError(err);
          reject(message);
        });
    });
  }

  /**
   * Return an array of products. 
   */
  getProducts(): Promise<productGet[]> {
    alert(this.iap.toString())
    for(let prop in this.iap){
alert(this.iap[prop]);
    }
    return new Promise((resolve, reject) => {
      this.iap.getProducts(['everything'])
        .then(products => resolve(products))
        .catch(err => {
          const message = this.handleError(err);
          reject(message);
        });
    });
  }
}
