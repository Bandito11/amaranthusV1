import { ISimpleAlertOptions } from './../../common/models';
import { AmaranthusDBProvider } from './../../providers/amaranthus-db/amaranthus-db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ClientloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clientlogin',
  templateUrl: 'clientlogin.html'
})
export class ClientLoginPage {
  constructor(private alertCtrl: AlertController, private db: AmaranthusDBProvider, public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientloginPage');
  }

  checkUser(opts: { username: string; password }) {
    const user = {
      ...opts,
      username: opts.username.toLowerCase()
    };
    const response = this.db.checkIfUserExists(opts);
    let options: ISimpleAlertOptions;
    if (response.success) {
      options = {
        title: 'Success!',
        subTitle: `${response.data} is present today!`
      };
    } else {
      options = {
        title: 'Error!',
        subTitle: response.error
      };
    }
    this.showSimpleAlert(options);
  }

  private showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl
      .create({
        title: options.title,
        subTitle: options.subTitle,
        buttons: options.buttons
      })
      .present();
  }
}
