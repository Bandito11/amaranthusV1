import { IStudent, IResponse, IRecord } from './../../common/interface';
import { Injectable } from '@angular/core';
import { IonicStorageAdapter } from './../../common/adapter';
import * as Loki from 'lokijs';
//////////// Only for dev purposes ////////////////
// import { STUDENTS, RECORDS } from './../../mock/mock-students';
///////////////////////////////////

let studentsColl: LokiCollection<IStudent>;
let recordsColl: LokiCollection<IRecord>;
let db: Loki;
const dbName = 'amaranthus.db';
@Injectable()
export class AmaranthusDBProvider {

  constructor() {
    this.createDB();
  }

  ///////////////////////////////////////
  // Only for dev purposes!!!!!!!!!
  // devInsertStudentsIntoDb() {
  //   this.oldStudentsData.data.map(student => students.insert(student))
  // }
  // devInsertRecordsIntoDb() {
  //   this.oldRecordsData.data.map(record => records.insert(record));
  // }
  //////////////////////////////////////

  ///// Only for dev purposes///////////
  // oldStudentsData: IResponse<IStudent[]>;
  // oldRecordsData: IResponse<IRecord[]>;
  /////////////////////////////////////////

  createDB() {
    const ionicStorageAdapter = new IonicStorageAdapter();
    const lokiOptions: LokiConfigureOptions = {
      autosave: true,
      autoload: true,
      adapter: ionicStorageAdapter,
      autoloadCallback: this.loadDatabase,
      autosaveCallback: this.saveDatabase
    }
    db = new Loki(dbName, lokiOptions);
    /////// Only for dev Purposes /////////
    // this.oldStudentsData = { ...STUDENTS };
    // this.oldRecordsData = { ...RECORDS };
    // this.devInsertStudentsIntoDb();
    // this.devInsertRecordsIntoDb();
    ////////////////////////////////////
  }

  saveDatabase() {
    db.saveDatabase();
  }

  loadDatabase() {
    studentsColl = db.getCollection<IStudent>('students');
    recordsColl = db.getCollection<IRecord>('records');
    if (!studentsColl && !recordsColl) {
      studentsColl = db.addCollection<IStudent>('students')
      recordsColl = db.addCollection<IRecord>('records');
    }
  }

  checkIfUserExists(opts: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let results = studentsColl.findOne({
          'id': { '$eq': opts.id }
        });
        results ? resolve(true) : resolve(false);
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    let response;
    return new Promise((resolve, reject) => {
      this.checkIfUserExists({ id: student.id })
        .then(value => {
          try {
            if (value == false) {
              studentsColl.insert(student);
              response = { success: true, error: null, data: null };
            } else {
              response = { success: false, error: 'User already exists in the database', data: null };
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

  addAbsence(opts: { date: Date, id: string }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.updateRecord({ ...opts, attendance: false, absence: true })
        .then(res => resolve(res))
        .catch(error => reject(error))
    })
  }

  addAttendance(opts: { date: Date, id: string }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      this.updateRecord({ ...opts, attendance: true, absence: false })
        .then(res => resolve(res))
        .catch(error => reject(error))
    });
  }

  updateRecord(opts: { attendance: boolean, absence: boolean, date: Date, id: string }): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        const record: IRecord = {
          id: opts.id,
          month: opts.date.getMonth() + 1,
          year: opts.date.getFullYear(),
          day: opts.date.getDate(),
          attendance: opts.attendance,
          absence: opts.absence
        }
        let results = recordsColl.findOne({
          'id': { '$eq': record.id },
          'month': { '$eq': record.month },
          'year': { '$eq': record.year },
          'day': { '$eq': record.day }
        });
        if (results) {
          results = { ...results, ...record };
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
          'id': { '$eq': student.id }
        });
        results = { ...results, ...student };
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
          'id': { '$eq': student.id }
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
          'id': { '$eq': student.id }
        });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    });
  }


  getQueriedRecords(opts: { query: string, date?: { year: number, month: number } }): Promise<IResponse<IRecord[]>> {
    let response = { success: true, error: null, data: null };
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
            .catch(error => reject(error));
      }
    });
  }

  getAllStudentsRecords(opts: { year: number, month: number }): Promise<IResponse<IRecord[]>> {
    let response = { success: true, error: null, data: [] };
    let attendance: number;
    let absence: number;
    return new Promise((resolve, reject) => {
      try {
        const students = studentsColl.find({
          'isActive': { '$eq': true }
        });
        students.map((student: IStudent) => {
          attendance = 0;
          absence = 0;
          const records = recordsColl.find({
            'id': { '$eq': student.id },
            'year': { '$eq': opts.year },
            'month': { '$eq': opts.month }
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
            response = {
              ...response,
              data: [...response.data, {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                attendance: attendance,
                absence: absence
              }]
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

  // query by isActive
  getAllActiveStudents(): Promise<IResponse<any>> {
    return new Promise((resolve, reject) => {
      try {
        const results = studentsColl.find({ 'isActive': { '$eq': true } });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        if (studentsColl) {
          reject(error);
        }
      }
    })
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

  getQueriedRecordsByDate(opts: { year: number, month: number }): Promise<IResponse<IRecord[]>> {
    return new Promise((resolve, reject) => {
      this.getAllStudentsRecords(opts)
        .then(res => resolve(res))
        .catch(error => reject(error))
    });
  }


}
