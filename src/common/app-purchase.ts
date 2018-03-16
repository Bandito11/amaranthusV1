export enum stateAndroid {
    ACTIVE,
    CANCELLED,
    REFUNDED
  }

  export interface productGet {
    productId: string;
    title: string;
    description: string;
    currency: string;
    price: any;
    priceAsDecimal: any;
}
export interface productBought {
    transactionId: string;
    receipt: string;
    signature: string;
    productType: string;
}
export interface productRestore {
    productId: string;
    state: string | number;
    transactionId: string;
    type:string;
    date: string;
    productType: string;
    receipt;
    signature: string;
}