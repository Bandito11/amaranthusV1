import { Storage } from '@ionic/storage';
import { IStudent, IResponse, IRecord, Calendar } from './../../common/interface';
import { Injectable } from '@angular/core';
import { IonicStorageAdapter } from './../../common/adapter';
import * as Loki from 'lokijs';
// /// Only for dev purposes //////////////// import { STUDENTS, RECORDS } from
// './../../mock/mock-students'; /////////////////////////////////

let studentsColl: Collection<IStudent>;
let recordsColl: Collection<IRecord>;
let db: Loki;
const dbName = 'amaranthus.db';

@Injectable()
export class AmaranthusDBProvider {

  constructor(private storage: Storage) {
    this.createDB();
  }

  // ///////////////////////////////////// Only for dev purposes!!!!!!!!!
  // devInsertStudentsIntoDb() {   this.oldStudentsData.data.map(student =>
  // students.insert(student)) } devInsertRecordsIntoDb() {
  // this.oldRecordsData.data.map(record => records.insert(record)); }
  // //////////////////////////////////// /// Only for dev purposes///////////
  // oldStudentsData: IResponse<IStudent[]>; oldRecordsData: IResponse<IRecord[]>;
  // ///////////////////////////////////////

  private createDB() {
    const ionicStorageAdapter = new IonicStorageAdapter();
    const lokiOptions: Partial<LokiConfigOptions> = {
      autosave: true,
      autoload: true,
      adapter: ionicStorageAdapter,
      autoloadCallback: this.loadDatabase,
      autosaveCallback: this.saveDatabase
    }
    db = new Loki(dbName, lokiOptions);
    // ///// Only for dev Purposes ///////// this.oldStudentsData = { ...STUDENTS };
    // this.oldRecordsData = { ...RECORDS }; this.devInsertStudentsIntoDb();
    // this.devInsertRecordsIntoDb(); //////////////////////////////////
  }

  private saveDatabase() {
    db.saveDatabase();
  }

  private loadDatabase() {
    studentsColl = db.getCollection<IStudent>('students');
    recordsColl = db.getCollection<IRecord>('records');
    if (!studentsColl && !recordsColl) {
      studentsColl = db.addCollection<IStudent>('students')
      recordsColl = db.addCollection<IRecord>('records');
    }
  }

  checkIfStudentExists(opts: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let results = studentsColl.findOne({
          'id': {
            '$eq': opts.id
          }
        });
        results
          ? resolve(true)
          : resolve(false);
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }

  insertStudentIntoDB(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      let response;
      this
        .checkIfStudentExists({ id: student.id })
        .then(value => {
          try {
            if (value == false) {
              studentsColl.insert(student);
              response = {
                success: true,
                error: null,
                data: null
              };
            } else {
              response = {
                success: false,
                error: 'User already exists in the database',
                data: null
              };
            }
            this.saveDatabase();
            resolve(response);
          } catch (error) {
            reject(error);
          }
        })
        .catch(error => reject(error));
    });
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    let response: IResponse<null>;
    return new Promise((resolve, reject) => {
      if (studentsColl.data.length > 9) {
        this.storage.get('boughtMasterKey')
          .then(boughtMasterKey => {
            if (boughtMasterKey == true) {
              this
                .insertStudentIntoDB(student)
                .then(res => resolve(res))
                .catch(err => reject(err));
            } else {
              response = {
                success: false,
                error: `Reached the limit of 10 persons in database. If you want to get rid of this limit please consider buying the app!`,
                data: null
              };
              resolve(response);
            }
          })
      } else {
        this
          .insertStudentIntoDB(student)
          .then(res => resolve(res))
          .catch(err => reject(err));
      }
    });
  }

  addAbsence(opts: { date: Calendar, id: string }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.updateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: false,
        absence: true
      })
        .then(res => resolve(res))
        .catch(error => reject(error))
    })
  }

  addAttendance(opts: { date: Calendar, id: string }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.updateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: true,
        absence: false
      })
        .then(res => resolve(res))
        .catch(error => reject(error))
    });
  }

  updateRecord(opts: {
    attendance: boolean,
    absence: boolean,
    date: Calendar,
    id: string
  }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        const record: IRecord = {
          id: opts.id,
          month: opts.date.month,
          year: opts.date.year,
          day: opts.date.day,
          attendance: opts.attendance,
          absence: opts.absence
        }
        let results = recordsColl.findOne({
          'id': {
            '$eq': record.id
          },
          'month': {
            '$eq': record.month
          },
          'year': {
            '$eq': record.year
          },
          'day': {
            '$eq': record.day
          }
        });
        if (results) {
          results = {
            ...results,
            ...record
          };
          recordsColl.update(results);
        } else {
          recordsColl.insert(record);
        }
        this.saveDatabase();
        resolve({ success: true, error: null, data: null });
      } catch (error) {
        if (recordsColl) {
          reject(error);
        }
      }
    });
  }
  updateStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        let results: any = studentsColl.findOne({
          'id': {
            '$eq': student.id
          }
        });
        results = {
          ...results,
          ...student
        };
        studentsColl.update(results);
        this.saveDatabase();
        resolve({ success: true, error: null, data: null })
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }

  deleteStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        let results: any = studentsColl.findOne({
          'id': {
            '$eq': student.id
          }
        });
        studentsColl.remove(results);
        this.saveDatabase();
        resolve({ success: true, error: null, data: null })
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }

  getStudentById(student: IStudent): Promise<IResponse<IStudent>> {
    return new Promise((resolve, reject) => {
      try {
        const results = studentsColl.findOne({
          'id': {
            '$eq': student.id
          }
        });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }

  getQueriedRecords(opts: { query: string, date?: Calendar }): Promise<IResponse<IRecord[]>> {
    let response = {
      success: true,
      error: null,
      data: null
    };
    return new Promise((resolve, reject) => {
      switch (opts.query) {
        case 'Date':
          this.getQueriedRecordsByDate(opts.date);
          break;
        default:
          const options:
            Calendar = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: null
            }
          this
            .getAllStudentsRecords(options)
            .then(res => {
              response = {
                ...res
              }
              resolve(response);
            })
            .catch(error => reject(error));
      }
    });
  }

  getStudentsRecordsByDate(opts: Calendar): Promise<IResponse<IRecord[]>> {
    let response = {
      success: true,
      error: null,
      data: []
    };
    return new Promise((resolve, reject) => {
      try {
        const students = studentsColl.find({
          'isActive': {
            '$eq': true
          }
        });

        students.map((student: IStudent) => {
          const record = recordsColl.findOne({
            'id': {
              '$eq': student.id
            },
            'year': {
              '$eq': opts.year
            },
            'month': {
              '$eq': opts.month
            },
            'day': {
              '$eq': opts.day
            }
          });
          if (record) {
            if (student.id == record.id) {
              response = {
                ...response,
                data: [
                  ...response.data, {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    fullName: `${student.firstName} ${student.lastName}`,
                    picture: student.picture,
                    attendance: record.attendance,
                    absence: record.absence,
                    id: student.id
                  }
                ]
              };
            }
          } else {
            response = {
              ...response,
              data: [
                ...response.data, {
                  firstName: student.firstName,
                  lastName: student.lastName,
                  fullName: `${student.firstName} ${student.lastName}`,
                  picture: student.picture,
                  attendance: false,
                  absence: false,
                  id: student.id
                }
              ]
            };
          };
        });
        resolve(response);
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
        if (recordsColl) {
          reject(error);
        }
      }
    });
  }

  getAllStudentsRecords(opts: Calendar): Promise<IResponse<IRecord[]>> {
    let response = {
      success: true,
      error: null,
      data: []
    };
    let attendance: number;
    let absence: number;
    return new Promise((resolve, reject) => {
      try {
        const students = studentsColl.find({
          'isActive': {
            '$eq': true
          }
        });
        students.map((student: IStudent) => {
          attendance = 0;
          absence = 0;
          const records = recordsColl.find({
            'id': {
              '$eq': student.id
            },
            'year': {
              '$eq': opts.year
            },
            'month': {
              '$eq': opts.month
            }
          });
          if (records) {
            records.map((record: IRecord) => {
              if (record.attendance == true) {
                attendance++;
              }
              if (record.absence == true) {
                absence++;
              }
            });
            let percent = '0';
            if (attendance + absence != 0) {
              percent = (100 * attendance / (attendance + absence)).toFixed(2);
            }
            if (percent) {
              response = {
                ...response,
                data: [
                  ...response.data, {
                    id: student.id,
                    fullName: `${student.firstName} ${student.lastName}`,
                    attendance: attendance,
                    percent: percent,
                    absence: absence,
                    picture: student.picture
                  }
                ]
              };
            } else {
              response = {
                ...response,
                data: [
                  ...response.data, {
                    id: student.id,
                    fullName: `${student.firstName} ${student.lastName}`,
                    attendance: attendance,
                    percent: 0,
                    absence: absence,

                    picture: student.picture
                  }
                ]
              };
            }
          };
        });
        resolve(response);
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
        if (recordsColl) {
          reject(error);
        }
      }
    });
  }

  // query by isActive
  getAllStudents(): Promise<IResponse<IStudent[]>> {
    return new Promise((resolve, reject) => {
      try {
        const results = studentsColl.data;
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    })
  }

  getQueriedRecordsByDate(opts: Calendar): Promise<IResponse<IRecord[]>> {
    return new Promise((resolve, reject) => {
      this
        .getAllStudentsRecords(opts)
        .then(res => resolve(res))
        .catch(error => reject(error))
    });
  }

  // query by isActive
  getAllActiveStudents(): Promise<IResponse<any>> {
    return new Promise((resolve, reject) => {
      try {
        const students = studentsColl.find({
          'isActive': {
            '$eq': true
          }
        });
        const currentDate = {
          day: new Date().getDate(),
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        };
        let record: IRecord;
        const results = students.map(student => {
          record = {
            ...this.getQueriedRecordsByCurrentDate({ studentId: student.id, year: currentDate.year, day: currentDate.day, month: currentDate.month })
          };
          if (record != null && record.id == student.id) {
            return {
              ...student,
              attendance: record.attendance,
              absence: record.absence
            };
          } else {
            return {
              ...student,
              attendance: false,
              absence: false
            };
          }
        });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    })
  }

  getQueriedRecordsByCurrentDate(opts: {
    studentId: string,
    day: number,
    year: number,
    month: number
  }): IRecord {
    let response: IRecord;
    try {
      const recordQuery = recordsColl.findOne({
        'id': {
          '$eq': opts.studentId
        },
        'year': {
          '$eq': opts.year
        },
        'day': {
          '$eq': opts.day
        },
        'month': {
          '$eq': opts.month
        }
      });
      if (recordQuery) {
        response = recordQuery;
        return response;
      } else {
        return null;
      }
    } catch (error) {
      if (recordsColl) {
        setTimeout(() => this.getQueriedRecordsByCurrentDate(opts), 5000);
      } else {
        return null;
      }
    }
  }

}
