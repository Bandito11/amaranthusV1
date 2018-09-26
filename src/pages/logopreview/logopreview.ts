import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-logopreview',
  templateUrl: 'logopreview.html',
})
export class LogoPreviewPage {

  logo: string;
  
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    this.logo = this.navParams.get('logo');
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

}
