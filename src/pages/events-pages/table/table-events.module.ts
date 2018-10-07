import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TableEventsPage } from './table-events';
import { ExportPageModule } from '../../export/export.module';

@NgModule({
  declarations: [
    TableEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(TableEventsPage),
    ExportPageModule
  ],
})
export class TableEventsPageModule {}
