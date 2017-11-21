import { STUDENTS } from './../../mock/mock-students';
import { IStudent, IResponse } from './../../common/interface';
import { Injectable } from '@angular/core';

/*
  Generated class for the AmaranthusDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AmaranthusDBProvider {

  constructor() {
    console.log('Hello AmaranthusDbProvider Provider');
    this.createDB();
  }

  /**
   * Will get Students from DB
   * Will only return firstName, lastName and studentId
   * @returns {Observable<IResponse<IStudent>>} 
   * @memberof AmaranthusDBProvider
   */

  students: IResponse<IStudent[]>;

  getAllStudents(): Promise<IResponse<IStudent[]>> {
    return new Promise((resolve, reject) => {
      resolve(this.students);
    })
  }

  handleError(error) {
    console.error(error);
    return { error: error, success: false, data: null };
  }

  createDB() {
    this.students = { ...STUDENTS };
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.students = { ...STUDENTS, data: [...this.students.data, student] };
      resolve({ success: true, error: null, data: null })
    });
  }

  updateStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      const queriedStudents = this.students.data.map(query => {
        if (query.id == student.id) {
          return student;
        } else {
          return query;
        }
      }); console.log('new query'); console.log(queriedStudents)
      this.students = { ...STUDENTS, data: [...queriedStudents] };;
      resolve({ success: true, error: null, data: null })
    })
  }
  getStudentById(student: IStudent): Promise<IResponse<IStudent>> {
    return new Promise((resolve, reject) => {
      this.students.data.filter(query => {
        if (student.id == query.id) {
          const queriedStudent = {
            error: null,
            success: true,
            data: { ...query }
          }
          resolve(queriedStudent);
        }
      });
    });
  }
  deleteStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.students.data = this.students.data.filter(query => {
        if (query.id != student.id) {
          return query;
        }
      });
      resolve({ success: true, error: null, data: null })
    });
  }
}
