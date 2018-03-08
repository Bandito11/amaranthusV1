import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { productRestore, productGet, productBought } from '../../common/app-purchase';

@Injectable()
export class AppPurchaseProvider {

  private _boughtEverything = false;

  public get boughtEverything(): boolean {
    return this._boughtEverything;
  }


  public set boughtEverything(v: boolean) {
    this._boughtEverything = v;
  }

  getProofOfPurchase() {
    return new Promise((resolve, reject) => {
      this.restore()
        .catch(err => reject(err));
    });
  }

  constructor(private iap: InAppPurchase) {
  }

  /**
   * Restore purchase
   */
  restore():Promise<productRestore[]>{
    return new Promise((resolve, reject) => {
      this.iap.restorePurchases()
        .then(purchased => resolve(purchased))
        .catch(err => reject(err))
    })
  }
  /**
   * Buy Product
   */
  buy(productId): Promise<productBought> {
    return new Promise((resolve, reject) => {
      this.iap.buy(productId)
        .then(product => resolve(product))
        .catch(err => console.log(err))
    });
  }

  /**
   * Return an array of products. 
   */
  getProducts(): Promise<productGet[]> {
    return new Promise((resolve, reject) => {
      this.iap.getProducts(['everything'])
        .then(products => resolve(products))
        .catch(err => reject(err))
    });
  }
}
