import { Injectable } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { IResponse } from '../../common/interface';

interface IIAPProducts {
  id: string;
  alias: string;
}
@Injectable()
export class AppPurchaseProvider {

  constructor(private store: InAppPurchase2) {
    this.createProducts();
    this.register();
  }

  private products: IIAPProducts[];

 /**
  * Register each product to IAP
  */
  private register() {
    this.products.forEach(product => {
      this.store.register({
        id: product.id,
        alias: product.alias,
        type: this.store.NON_CONSUMABLE
      });
    });
  }

  /**
   * Create Product Array
   */
  private createProducts() {
    this.products = [
      {
        id: 'nodblimits',
        alias: 'Unlimited user creation'
      }
    ];
  }

  /**
   * Return an array of products. 
   */
  listIAPProduct(): Promise<IResponse<IAPProduct[]>>{
    return new Promise((resolve, reject) => {
      let iAPProduct: IAPProduct;
      let response: IResponse<IAPProduct[]> = {
        success: true,
        error: '',
        data: []
      }
      this.products.forEach(product => {
        iAPProduct = this.store.get(product.id);
        if(iAPProduct){
          response = {...response, data: [...response.data, iAPProduct]};
        }else{
          response = {...response, success: false};
        }
      });
      resolve(response)
    });
  }
}
