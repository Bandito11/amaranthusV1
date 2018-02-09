import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { CSVProvider } from '../../providers/csv/csv';
import { TextTabDelimitedProvider } from '../../providers/text-tab-delimited/text-tab-delimited';
import { FileProvider } from '../../providers/file/file';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { IRecord } from '../../common/interface';
import { handleError } from '../../common/handleError';

/**
 * Generated class for the ExportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-export',
  templateUrl: 'export.html',
})
export class ExportPage {

  students;
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private csv: CSVProvider,
    private textTab: TextTabDelimitedProvider,
    private file: FileProvider
  ) {
  }
  ionViewDidEnter() {
    this.students = this.navParams.get('students');
  }
  async exportTextTabToFile() {
    try {
      const textTabResponse = await this.textTab.exportTextTabDelimited(this.students);
      if (textTabResponse.success) {
        try {
          const fileResponse = await this.file.exportFile({ fileName: 'Attendance-Log-TextTabDelimited.txt', text: textTabResponse.data });
          if (fileResponse.success) {
            this.viewCtrl.dismiss('File was downloaded successfully to your Download folder!');
          }
        } catch (error) {//If FileProvider err
          this.viewCtrl.dismiss('Error while saving the data, please try again!');
        }

      }
    } catch (error) {// If TextTabDelimited Provider err
      this.viewCtrl.dismiss('There was an error while creating the file. Please try again later!');
    }

  }

  async exportCSVToFile() {

  }

  async exportXLSXToFile() {

  }
}
