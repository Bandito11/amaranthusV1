import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientLoginPage } from './clientlogin';

@NgModule({
  declarations: [
    ClientLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientLoginPage),
  ],
})
export class ClientLoginPageModule {}
