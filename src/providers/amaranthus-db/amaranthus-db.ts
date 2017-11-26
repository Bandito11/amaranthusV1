import { STUDENTS, RECORDS } from './../../mock/mock-students';
import { IStudent, IResponse, IRecords } from './../../common/interface';
import { Injectable } from '@angular/core';

/*
  Generated class for the AmaranthusDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AmaranthusDBProvider {

  constructor() {
    this.createDB();
  }

  /**
   * Will get Students from DB
   * Will only return firstName, lastName and studentId
   * @returns {Observable<IResponse<IStudent>>} 
   * @memberof AmaranthusDBProvider
   */

  students: IResponse<IStudent[]>;
  records: IResponse<any>;

  // query by isActive
  getAllActiveStudents(): Promise<IResponse<IStudent[]>> {
    return new Promise((resolve, reject) => {
      resolve(this.students);
    })
  }

  getQueriedRecords(opts: { query: string, date?: { year: number, month: number } }): Promise<IResponse<IRecords[]>> {
    let response: IResponse<any> = { success: true, error: null, data: null };
    return new Promise((resolve, reject) => {
      switch (opts.query) {
        case 'Date':
          this.getQueriedRecordsByDate(opts.date);
          break;
        default:
          const options = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1
          }
          this.getAllStudentsRecords(options)
            .then(res => {
              response = { ...res }
              resolve(response);
            })
      }
    });
  }

  getQueriedRecordsByDate(opts: { year: number, month: number }): Promise<IResponse<IRecords[]>> {
    const response: IResponse<any> = { success: true, error: null, data: [] };
    let attendance;
    let absence;
    return new Promise((resolve, reject) => {
      this.students.data.map(student => {
        attendance = 0;
        absence = 0;
        try {
          if (this.records.data[student.id]) {
            // for (const year in this.records.data[student.id]) {
            // for (let j = 0; j < 12; j++) { // <= months
            if (this.records.data[student.id][opts.year][opts.month]) {
              // for (const month in this.records.data[student.id][opts.year][j + 1]) {
              for (let i = 1; i < 31; i++) {
                if (this.records.data[student.id][opts.year][opts.month]) {
                  if (this.records.data[student.id][opts.year][opts.month][i]) {
                    if (this.records.data[student.id][opts.year][opts.month][i].attendance) {
                      attendance++;
                    }
                    if (this.records.data[student.id][opts.year][opts.month][i].absence) {
                      absence++;
                    }
                  }
                }
                // }
                //   }
                // }
              }
            };
            response.data = [...response.data, {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              attendance: attendance,
              absence: absence
            }]
          }
        } catch (error) {

        }

      });
      resolve(response);
    });
  }
  getAllStudentsRecords(opts: { year: number, month: number }): Promise<IResponse<IRecords[]>> {
    const response: IResponse<any> = { success: true, error: null, data: [] };
    let attendance;
    let absence;
    return new Promise((resolve, reject) => {
      this.students.data.map(student => {
        attendance = 0;
        absence = 0;
        try {
          if (this.records.data[student.id]) {
            // for (const year in this.records.data[student.id]) {
            // for (let j = 0; j < 12; j++) { // <= months
            if (this.records.data[student.id][opts.year][opts.month]) {
              // for (const month in this.records.data[student.id][opts.year][j + 1]) {
              for (let i = 1; i < 31; i++) {
                if (this.records.data[student.id][opts.year][opts.month]) {
                  if (this.records.data[student.id][opts.year][opts.month][i]) {
                    if (this.records.data[student.id][opts.year][opts.month][i].attendance) {
                      attendance++;
                    }
                    if (this.records.data[student.id][opts.year][opts.month][i].absence) {
                      absence++;
                    }
                  }
                }
                // }
                //   }
                // }
              }
            };
            response.data = [...response.data, {
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              attendance: attendance,
              absence: absence
            }]
          }

        } catch (error) {

        }
      });
      resolve(response);
    });
  }
  getQueryStudentsByAttendance(): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {

    })
  }
  getQueryStudentsByAbsence(): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {

    })
  }
  getQueryStudentsByYear(): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {

    })
  }
  getQueryStudentsByName(): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {

    })
  }
  getQueryStudentsByMonth(): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {

    })
  }


  handleError(error) {
    console.error(error);
    return { error: error, success: false, data: null };
  }

  createDB() {
    this.students = { ...STUDENTS };
    this.records = { ...RECORDS };
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.students = { ...STUDENTS, data: [...this.students.data, student] };
      resolve({ success: true, error: null, data: null })
    });
  }

  updateStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      const queriedStudents = [...this.students.data.map(query => {
        if (query.id == student.id) {
          return student;
        } else {
          return query;
        }
      })];
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
      this.students.data = [...this.students.data.filter(query => {
        if (query.id != student.id) {
          return query;
        }
      })];
      resolve({ success: true, error: null, data: null })
    });
  }
}
