import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoPreviewPage } from './logopreview';

@NgModule({
  declarations: [
    LogoPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(LogoPreviewPage),
  ],
})
export class LogoPreviewPageModule {}
