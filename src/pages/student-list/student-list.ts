import { ISimpleAlertOptions } from '../../common/models';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { handleError } from '../../common/handleError';
import { StudentProfilePage } from '../student-profile/student-profile';
import { CreatePage } from '../create/create';
import { IStudent } from '../../common/models';
import { AmaranthusDBProvider } from '../../providers/amaranthus-db/amaranthus-db';
import { sortStudentsbyId, sortStudentsName, filterStudentsList } from '../../common/search'
/**
 * Generated class for the StudentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-student-list', templateUrl: 'student-list.html' })
export class StudentListPage {
  students: IStudent[] = [];
  private unfilteredStudents: IStudent[] = [];
  query: string;
  selectOptions: string[] = ['Id', 'Name', 'Active', 'Not Active', 'None'];
  filterOptions: string[];

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AmaranthusDBProvider
  ) { }

  private initializeStudentsList() {
    this.students = [...this.unfilteredStudents];
  };


  ionViewWillEnter() {
    this.query = "None";
    this.getStudents();
    this.filterOptions = this.getFilterOptions();
  }
  getFilterOptions() {
    let options = [];
    let checkIfHaveClass = this.students.filter(student => {
      if (student.class) return true;
    });
    for (const student of checkIfHaveClass) {
      if (options.indexOf(student.class) == -1) {
        options = [...options, student.class];
      }
    }
    options = [...options, 'None'];
    return options;
  };

  filterByClass(option: string) {
    switch (option) {
      case 'Active':
      case 'Not Active':
        this.filterByIsActive(option);
        break;
      case 'None':
        this.initializeStudentsList();
        break;
      default:
        const newQuery = this.unfilteredStudents.filter(student => {
          if (student.class == option) {
            return student;
          }
        });
        this.students = [...newQuery];
    }
  }

  searchStudent(event) {
    let query: string = event.target.value;
    query ? this.queryStudentsList(query) : this.initializeStudentsList();
  }

  private getStudents() {
    try {
      const response = this.db.getAllStudents();
      if (response.success == true) {
        this.students = [...response.data];
        this.unfilteredStudents = [...response.data];
      } else {
        const options: ISimpleAlertOptions = {
          title: 'Error',
          subTitle: response.error,
          buttons: ['OK', 'Cancel']
        }
        this.showSimpleAlert(options);
      }
    } catch (error) {
      handleError(error);
    }
  }

  sortData(option: string) {
    switch (option) {
      case 'Id':
        this.sortStudentsbyId();
        break;
      case 'Name':
        this.sortStudentsName();
        break;
      default:
        this.students = [...this.unfilteredStudents];
    }
  }

  // sortByIsActive(query: string) {
  //   if (query == 'Active') {
  //     this.students = [
  //       ...this.students.sort((a, b) => {
  //         if (a.isActive == true)
  //           return -1;
  //         if (a.isActive == false)
  //           return 1;
  //         return 0;
  //       })
  //     ];
  //   } else {
  //     this.students = [
  //       ...this.students.sort((a, b) => {
  //         if (a.isActive == false)
  //           return -1;
  //         if (a.isActive == true)
  //           return 1;
  //         return 0;
  //       })
  //     ];
  //   }
  // }

  filterByIsActive(option: string) {
    let filteredStudents;
    if (option == 'Active') {
      filteredStudents = this.unfilteredStudents.filter(student => {
        if (student.isActive) return student;
      });
    } else {
      filteredStudents = this.unfilteredStudents.filter(student => {
        if (!student.isActive) return student;
      });
    }
    this.students = filteredStudents;
  }
  sortStudentsbyId() {
    this.students = sortStudentsbyId(this.students);
  }

  sortStudentsName() {
    this.students = sortStudentsName(this.students);
  }

  private queryStudentsList(query: string) {
    this.students = filterStudentsList({ query: query, students: this.unfilteredStudents })
  }

  goToStudentProfile(id: string) {
    this.navCtrl.push(StudentProfilePage, { id: id })
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }

  showSimpleAlert(options: ISimpleAlertOptions) {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.subTitle,
      buttons: options.buttons
    })
      .present();;
  }

}
