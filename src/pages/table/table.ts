import {Storage} from '@ionic/storage';
import {monthsLabels, yearLabels} from './../../common/labels';
import {Component, OnInit} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AmaranthusDBProvider} from '../../providers/amaranthus-db/amaranthus-db';
import {handleError} from '../../common/handleError';
import {IRecord, Calendar, ISimpleAlertOptions} from '../../common/interface';
import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {ModalController} from 'ionic-angular/components/modal/modal-controller';
import {ExportPage} from '../export/export';
import {AppPurchaseProvider} from '../../providers/app-purchase/app-purchase';
import {stateAndroid} from '../../common/app-purchase';

@IonicPage()
@Component({selector: 'page-table', templateUrl: 'table.html'})

export class TablePage implements OnInit {

  constructor(private storage : Storage, private db : AmaranthusDBProvider, private alertCtrl : AlertController, private modalCtrl : ModalController, private iap : AppPurchaseProvider) {}

  students : IRecord[];
  private untouchedStudentList : IRecord[];
  query : string;
  monthQuery : string;
  months : string[];
  currentDate : Date;
  yearQuery : string;
  years : number[];
  selectOptions : string[];
  // dateQuery: string; // Will be used with the date time component
  bought : boolean;

  ionViewWillEnter() {
    this.query = "None";
    this.getStudentsRecords();
    this.checkIfBought();
  }

  ngOnInit() {
    this.bought = false;
    this.currentDate = new Date();
    // this.dateQuery =
    // `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() - 1}`; //
    // will be used with the date time component
    this.months = [...monthsLabels];
    this.monthQuery = this.months[
      this
        .currentDate
        .getMonth()
    ];
    this.students = [];
    this.untouchedStudentList = [];
    this.yearQuery = this
      .currentDate
      .getFullYear()
      .toString();
    this.years = [...yearLabels]
    this.selectOptions = [
      'Id',
      'Attendance',
      'Absence',
      'Date',
      'Name',
      'None'
    ];
  }

  exportMessage() {
    const opts = {
      buttons: ['OK'],
      subTitle: 'If you want to export the records to a file please consider buying the product.',
      title: 'Information!'
    };
    this.showSimpleAlert(opts);
  }

  checkIfBought() {
    this
      .storage
      .get('bought')
      .then(bought => {
        console.log(bought)
        if (bought) {
          this.bought = bought;
        } else {
          this
            .iap
            .restore()
            .then((products) => {
              products.forEach(product => {
                const receipt = JSON.parse(product.receipt);
                if (product.productId == 'master.key' && stateAndroid[receipt.purchaseState] == ('ACTIVE' || 0)) {
                  this.bought = true;
                  this
                    .storage
                    .set('bought', this.bought)
                }
              })
            })
            .catch(err => this.showSimpleAlert({buttons: ['OK'], title: 'Error!', subTitle: err}));
        }
      })
      .catch(err => handleError(err));
  }

  initializeStudents() {
    this.students = [...this.untouchedStudentList];
  }

  queryData(option : string) {
    this.initializeStudents();
    switch (option) {
      case 'Id':
        this.queryStudentsbyId();
        break;
      case 'Attendance':
        this.queryStudentsbyAttendance();
        break;
      case 'Absence':
        this.queryStudentsbyAbsence();
        break;
      case 'Name':
        this.queryStudentsName();
        break;
      case 'Date':
        this.queryDataByYear(new Date().getFullYear());
        break;
      default:
        this.initializeStudents();
    }
  }

  queryDataByYear(year : number) {
    const date : Calendar = {
      year: + year,
      month: this
        .months
        .indexOf(this.monthQuery) + 1,
      day: null
    };
    this
      .db
      .getQueriedRecordsByDate(date)
      .then(response => {
        if (response.success == true) {
          this.students = [...response.data];
        }
      })
      .catch(error => handleError(error));
  }

  queryDataByMonth(index : number) {
    let date : Calendar;
    if (index) {
      date = {
        year: + this.yearQuery,
        month: index + 1,
        day: null
      }
    } else {
      date = {
        year: + this.yearQuery,
        month: new Date().getMonth() + 1,
        day: null
      }
    }
    this
      .db
      .getQueriedRecordsByDate(date)
      .then(response => {
        if (response.success == true) {
          this.students = [...response.data];
        }
      })
      .catch(error => handleError(error));
  }

  getStudentsRecords() {
    // Will get all Students queried by today's date.
    this
      .db
      .getQueriedRecords({query: this.query})
      .then(response => {
        if (response.success == true) {
          this.students = [...response.data];
          this.untouchedStudentList = [...response.data];
        } else {
          // TODO:  implement an alert message if it fails message should say no students
          // can be retrieved.
          handleError(response.error);
        }
      })
      .catch(error => handleError(error));
  }

  queryStudentsName() {
    this.students = [
      ...this
        .students
        .sort((a, b) => {
          if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) 
            return -1;
          if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) 
            return 1;
          return 0;
        })
    ];
  }

  queryStudentsbyAttendance() {
    this.students = [
      ...this
        .students
        .sort((a, b) => {
          if (a.attendance < b.attendance) 
            return 1;
          if (a.attendance > b.attendance) 
            return -1;
          return 0;
        })
    ];
  }

  queryStudentsbyAbsence() {
    this.students = [
      ...this
        .students
        .sort((a, b) => {
          if (a.absence < b.absence) 
            return 1;
          if (a.absence > b.absence) 
            return -1;
          return 0;
        })
    ];
  }

  queryStudentsbyId() {
    this.students = [
      ...this
        .students
        .sort((a, b) => {
          if (a.id < b.id) 
            return -1;
          if (a.id > b.id) 
            return 1;
          return 0;
        })
    ];
  }

  toExportPage() {
    const exportModal = this
      .modalCtrl
      .create(ExportPage, {students: this.students});
    exportModal.onDidDismiss(message => {
      if (message) {
        this.showSimpleAlert({buttons: ['OK'], title: 'Information!', subTitle: message});
      };
    });
    exportModal.present();

  }

  private showSimpleAlert(options : ISimpleAlertOptions) {
    return this
      .alertCtrl
      .create({title: options.title, subTitle: options.subTitle, buttons: options.buttons})
      .present();;
  }

}
