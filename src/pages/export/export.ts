import {Component} from '@angular/core';
import {IonicPage, NavParams, LoadingController} from 'ionic-angular';
import {CSVProvider} from '../../providers/csv/csv';
import {TextTabDelimitedProvider} from '../../providers/text-tab-delimited/text-tab-delimited';
import {FileProvider} from '../../providers/file/file';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {XLSXProvider} from '../../providers/xslx/xslx';

/**
 * TODO: Remember to add animation to every export method.
 */

@IonicPage()
@Component({selector: 'page-export', templateUrl: 'export.html'})
export class ExportPage {

  students;
  constructor(private loading : LoadingController, private viewCtrl : ViewController, private navParams : NavParams, private csv : CSVProvider, private textTab : TextTabDelimitedProvider, private file : FileProvider, private xlsx : XLSXProvider) {}
  ionViewDidEnter() {
    this.students = this
      .navParams
      .get('students');
    if (!this.students.length) {
      this.students = [];
    }
  }

  goBack() {
    this
      .viewCtrl
      .dismiss();
  }

  async exportTextTabToFile() {
    const loading = this
      .loading
      .create({dismissOnPageChange: true, content: 'Creating the File...'});
    loading.present();
    try {
      const textTabResponse = await this
        .textTab
        .exportTextTabDelimited(this.students);
      const fileName = 'AttendanceLog.txt';
      if (textTabResponse.success) {
        try {
          const fileResponse = await this
            .file
            .exportFile({fileName: fileName, text: textTabResponse.data, type: 'txt'});
          if (fileResponse.success) {
            loading.dismiss();
            this
              .viewCtrl
              .dismiss(fileResponse.data);
          }
        } catch (error) { //If FileProvider err
          loading.dismiss();
          this
            .viewCtrl
            .dismiss(error);
        }

      }
    } catch (error) { // If TextTabDelimited Provider err
      loading.dismiss();
      this
        .viewCtrl
        .dismiss('There was an error while creating the file. Please try again later!');
    }
  }

  async exportCSVToFile() {
    const loading = this
      .loading
      .create({dismissOnPageChange: true, content: 'Creating the File...'});
    loading.present();
    try {
      const csvResponse = await this
        .csv
        .exportCSV(this.students);
      const fileName = 'AttendanceLog.csv';
      if (csvResponse.success) {
        try {
          const fileResponse = await this
            .file
            .exportFile({fileName: fileName, text: csvResponse.data, type: 'csv'});
          if (fileResponse.success) {
            loading.dismiss();
            this
              .viewCtrl
              .dismiss(fileResponse.data);
          }
        } catch (error) { //If FileProvider err
          loading.dismiss();
          this
            .viewCtrl
            .dismiss(error);
        }

      }
    } catch (error) { // If CSV Provider err
      loading.dismiss();
      this
        .viewCtrl
        .dismiss('There was an error while creating the file. Please try again later!');
    }
  }

  async exportXLSXToFile() {
    const loading = this
      .loading
      .create({dismissOnPageChange: true, content: 'Creating the File...'});
    loading.present();
    try {
      const xlsxResponse = await this
        .xlsx
        .exportXLSXToFile(this.students);
      const fileName = 'AttendanceLog.xlsx';
      if (xlsxResponse.success) {
        try {
          const fileResponse = await this
            .file
            .exportFile({fileName: fileName, text: xlsxResponse.data, type: 'xlsx'});
          if (fileResponse.success) {
            loading.dismiss();
            this
              .viewCtrl
              .dismiss(fileResponse.data);
          }
        } catch (error) { //If FileProvider err
          loading.dismiss();
          this
            .viewCtrl
            .dismiss(error);
        }

      }
    } catch (error) { // If XLSX Provider err
      loading.dismiss();
      this
        .viewCtrl
        .dismiss('There was an error while creating the file. Please try again later!');
    }
  }
}
