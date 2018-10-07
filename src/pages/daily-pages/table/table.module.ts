import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TablePage } from './table';
import { ExportPageModule } from '../../export/export.module';

@NgModule({
  declarations: [
    TablePage,
  ],
  imports: [
    IonicPageModule.forChild(TablePage),
    ExportPageModule
  ],
})
export class TablePageModule {}
