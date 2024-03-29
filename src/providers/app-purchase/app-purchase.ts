import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { productRestore, productGet, productBought } from '../../common/models';

@Injectable()
export class AppPurchaseProvider {

  constructor(private iap: InAppPurchase) {
  }

  handleError(err) {
    let message = "";
    try {
      for (let prop in err) {
        try {
          message += `${err[prop]} `;
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
  restoreAndroidPurchase(): Promise<productRestore[]> {
    return new Promise((resolve, reject) => {
      this.iap.restorePurchases()
        .then(purchased => resolve(purchased))
        .catch(err => {
          const message = this.handleError(err);
          reject(message);
        });
    });
  }

  restoreiOSPurchase(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.iap.getReceipt()
        .then(receipt => resolve(receipt))
        .catch(error => reject(error));
    });
  }
  /**
   * Buy Product
   */
  buy(productId: string): Promise<productBought> {
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
    return new Promise((resolve, reject) => {
      this.iap.getProducts(['master.key'])
        .then(products => resolve(products))
        .catch(err => {
          const message = this.handleError(err);
          reject(message);
        });
    });
  }
}
