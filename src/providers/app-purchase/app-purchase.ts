import { Injectable } from '@angular/core';
import { InAppPurchase2, IAPProductOptions } from '@ionic-native/in-app-purchase-2';

@Injectable()
export class AppPurchaseProvider {

  constructor(private store: InAppPurchase2) { }

register(){
  this.store.register({
    id:'nodblimits',
    alias:'',
    type:'store.'
  });
}
}
