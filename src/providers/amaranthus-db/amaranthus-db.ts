import { Storage } from '@ionic/storage';
import { IStudent, IResponse, IRecord, ICalendar } from './../../common/interface';
import { Injectable } from '@angular/core';
import { IonicStorageAdapter } from './adapter';
import * as Loki from 'lokijs';
import { handleError } from '../../common/handleError';
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

  checkIfStudentExists(opts: { id: string }) {
    try {
      let results = studentsColl.findOne({
        'id': {
          '$eq': opts.id
        }
      });
      if (results) {
        return true
      }
      return false;
    } catch (error) {
      if (!studentsColl) {
        return error;
      }
    }
  }

  insertStudentIntoDB(student: IStudent): IResponse<null> {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    const value = this.checkIfStudentExists({ id: student.id })
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
      return response;
    } catch (error) {
      response = {
        ...response,
        error: error
      }
      return response;
    }
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    return new Promise((resolve, reject) => {
      if (studentsColl.data.length > 9) {
        this.storage.get('boughtMasterKey')
          .then(boughtMasterKey => {
            if (boughtMasterKey == true) {
              response = {
                ...response,
                ...this.insertStudentIntoDB(student)
              }
              if (response.success) {
                resolve(response);
              }
              reject(response);
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
        response = {
          ...response,
          ...this.insertStudentIntoDB(student)
        }
        if (response.success) {
          resolve(response);
        }
        reject(response);
      }
    });
  }

  addAbsence(opts: { date: ICalendar, id: string }): IResponse<null> {
    const response = this.updateRecord({
      ...opts,
      date: {
        ...opts.date,
        month: opts.date.month + 1
      },
      attendance: false,
      absence: true
    })
    return response;
  }

  addAttendance(opts: { date: ICalendar, id: string }): IResponse<null> {
    const response = this.updateRecord({
      ...opts,
      date: {
        ...opts.date,
        month: opts.date.month + 1
      },
      attendance: true,
      absence: false
    })
    return response;
  }

  updateRecord(
    opts: { attendance: boolean, absence: boolean, date: ICalendar, id: string }
  ) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    }
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
      response = {
        ...response,
        success: true,
        error: null,
        data: null
      };
      return response;
    } catch (error) {
      if (recordsColl) {
        response = {
          ...response,
          error: error || null
        }
        return response;
      }
    }
  }
  updateStudent(student: IStudent): IResponse<null> {
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
      return {
        success: true,
        error: null,
        data: null
      };
    } catch (error) {
      if (!studentsColl) {
        return error;
      }
    }
  }

  deleteStudent(student: IStudent): IResponse<null> {
    try {
      let results: any = studentsColl.findOne({
        'id': {
          '$eq': student.id
        }
      });
      studentsColl.remove(results);
      return {
        success: true,
        error: null,
        data: null
      };
    } catch (error) {
      if (!studentsColl) {
        return error;
      }
    }
  }

  getStudentById(student: IStudent): IResponse<IStudent> {
    let response: IResponse<IStudent> = {
      success: false,
      error: null,
      data: undefined
    }
    try {
      const results = studentsColl.findOne({
        'id': {
          '$eq': student.id
        }
      });
      response = {
        ...response,
        success: true,
        error: null,
        data: results
      };
      return response;
    } catch (error) {
      if (studentsColl) {
        return error;
      }
    }
  }

  getQueriedRecords(opts: { query: string, date?: ICalendar }): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: null
    };
      switch (opts.query) {
        case 'Date':
          this.getQueriedRecordsByDate(opts.date);
          break;
        default:
          const options:
            ICalendar = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: null
            }
          try {
            response = {
              ...response,
              ...this.getAllStudentsRecords(options)
            };
            return response;
          } catch (error) {
            return error;
          };
      }
  }

  getStudentsRecordsByDate(opts: ICalendar): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: []
    };
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
      return response;
    } catch (error) {
      if (studentsColl) {
        return error;
      }
      if (recordsColl) {
        return error;
      }
    }
  }

  getAllStudentsRecords(opts: ICalendar): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: []
    };
    let attendance: number;
    let absence: number;
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
      return response;
    } catch (error) {
      handleError(error);
      response = {
        ...response,
        error: error
      };
      return response;
    }
  }
  // query by isActive
  getAllStudents(): IResponse<IStudent[]> {
    let response: IResponse<IStudent[]> = {
      success: false,
      error: null,
      data: []
    };
    try {
      response = {
        ...response,
        success: true,
        data: [...studentsColl.data]
      }
      return response;
    } catch (error) {
      if (!studentsColl) {
        response.error = error;
        return response;
      }
    }
  }

  getQueriedRecordsByDate(opts: ICalendar): IResponse<IRecord[]> {
    try {
      return this.getAllStudentsRecords(opts)
    } catch (error) {
      return error;
    }
  }

  // query by isActive
  getAllActiveStudents(date: ICalendar): IResponse<IStudent[]> {
    try {
      const students = studentsColl.find({
        'isActive': {
          '$eq': true
        }
      });
      let record: IRecord;
      const results = students.map(student => {
        record = {
          ...this.getQueriedRecordsByCurrentDate({
            studentId: student.id,
            year: date.year,
            day: date.day,
            month: date.month
          })
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
      }); // got results
      return { success: true, error: null, data: results };
    } catch (error) {
      if (!studentsColl) {
        return error;
      }
    }
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
      }
      return null;
    } catch (error) {
      if (recordsColl) {
        setTimeout(() => this.getQueriedRecordsByCurrentDate(opts), 5000);
      } else {
        return null;
      }
    }
  }

}
