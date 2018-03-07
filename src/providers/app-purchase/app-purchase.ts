import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { IResponse } from '../../common/interface';

interface productGet {
  productId: string;
  title: string;
  description:string;
  currency:string;
  price:any;
  priceAsDecimal:any;
}

interface productRestore{
  productId: string;
  state: any;
  transactionId:string;
  date:string;
  productType:string;
  receipt:string;
  signature:string;
}


@Injectable()
export class AppPurchaseProvider {

  constructor(private iap: InAppPurchase) {
  }

  /**
   * Restore purchase
   */
  restore():Promise<productRestore[]> {
    return new Promise((resolve, reject) => {
      this.iap.restorePurchases()
        .then(purchased => resolve(purchased))
        .catch(err => reject(err))
    })
  }
  /**
   * Buy Product
   */
  buy(productId) {
    this.iap.buy(productId)
      .then(product => alert(product))
      .catch(err => console.log(err))
  }

  /**
   * Return an array of products. 
   */
  getProducts():Promise<productGet[]> {
    return new Promise((resolve, reject) => {
      this.iap.getProducts(['xyz.attendancelog.amaranthus.everything'])
        .then(products => resolve(products))
        .catch(err => reject(err))
    });
  }
}
