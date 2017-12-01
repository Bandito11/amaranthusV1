import { STUDENTS, RECORDS } from './../../mock/mock-students';
import { IStudent, IResponse, IRecords } from './../../common/interface';
import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import { IonicStorageAdapter } from './../../common/adapter';


@Injectable()
export class AmaranthusDBProvider {

  constructor() {
    this.createDB();
  }

  oldStudentsData: IResponse<IStudent[]>;
  oldRecordsData: IResponse<IRecords[]>;
  db: Loki;
  students: LokiCollection<IStudent>;
  records: LokiCollection<IRecords>;

  createDB() {
    const ionicStorageAdapter = new IonicStorageAdapter();
    const lokiOptions: LokiConfigureOptions = {
      autosave: true,
      autoload: true,
      adapter: ionicStorageAdapter
    }
    this.db = new Loki('amaranthus.db', lokiOptions);
    this.students = this.db.addCollection('students')
    this.records = this.db.addCollection('records');
    ///// Only for dev Purposes ///////
    this.oldStudentsData = { ...STUDENTS };
    this.oldRecordsData = { ...RECORDS };
    this.devInsertStudentsIntoDb();
    this.devInsertRecordsIntoDb();
    ////////////////////////////////////
  }

  saveDatabase() {
    this.db.saveDatabase();
  }

  // Only for dev purposes!!!!!!!!!
  devInsertStudentsIntoDb() {
    this.oldStudentsData.data.map(student => this.students.insert(student))
  }
  devInsertRecordsIntoDb() {
    this.oldRecordsData.data.map(record => this.records.insert(record));
  }

  ///////////////////////////

  checkIfUserExists(opts: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let results = this.students.findOne({
          'id': { '$eq': opts.id }
        });
        results ? resolve(true) : resolve(false);
      } catch (error) {
        reject(error);
      }
    });
  }

  insertStudent(student: IStudent): Promise<IResponse<null>> {
    let response: IResponse<any>;
    return new Promise((resolve, reject) => {
      this.checkIfUserExists({ id: student.id })
        .then(value => {
          try {
            if (value == false) {
              this.students.insert(student);
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
        const record: IRecords = {
          id: opts.id,
          month: opts.date.getMonth() + 1,
          year: opts.date.getFullYear(),
          day: opts.date.getDate(),
          attendance: opts.attendance,
          absence: opts.absence
        }
        let results = this.records.findOne({
          'id': { '$eq': record.id },
          'month': { '$eq': record.month },
          'year': { '$eq': record.year },
          'day': { '$eq': record.day }
        });
        if (results) {
          results = { ...results, ...record };
          this.records.update(results);
        } else {
          this.records.insert(record);
        }
        this.saveDatabase();
        resolve({ success: true, error: null, data: null });
      } catch (error) {
        reject(error);
      }
    });
  }
  updateStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        let results: any = this.students.findOne({
          'id': { '$eq': student.id }
        });
        results = { ...results, ...student };
        this.students.update(results);
        this.saveDatabase();
        resolve({ success: true, error: null, data: null })
      } catch (error) {
        reject(error)
      }
    });
  }

  deleteStudent(student: IStudent): Promise<IResponse<null>> {
    return new Promise((resolve, reject) => {
      try {
        let results: any = this.students.findOne({
          'id': { '$eq': student.id }
        });
        this.students.remove(results);
        this.saveDatabase();
        resolve({ success: true, error: null, data: null })
      } catch (error) {
        reject(error)
      }
    });
  }

  getStudentById(student: IStudent): Promise<IResponse<IStudent>> {
    return new Promise((resolve, reject) => {
      try {
        const results = this.students.findOne({
          'id': { '$eq': student.id }
        });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        reject(error);
      }
    });
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
            .catch(error => reject(error));
      }
    });
  }

  getAllStudentsRecords(opts: { year: number, month: number }): Promise<IResponse<IRecords[]>> {
    let response: IResponse<any> = { success: true, error: null, data: [] };
    let attendance: number;
    let absence: number;
    return new Promise((resolve, reject) => {
      try {
        const students = this.students.find({
          'isActive': { '$eq': true }
        });
        students.map((student: IStudent) => {
          attendance = 0;
          absence = 0;
          const records = this.records.find({
            'id': { '$eq': student.id },
            'year': { '$eq': opts.year },
            'month': { '$eq': opts.month }
          });
          if (records) {
            records.map((record: IRecords) => {
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
        reject(error);
      }
    });
  }

  // query by isActive
  getAllActiveStudents(): Promise<IResponse<any>> {
    return new Promise((resolve, reject) => {
      try {
        const results = this.students.find({ 'isActive': { '$eq': true } });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        reject(error);
      }
    })
  }

  // query by isActive
  getAllStudents(): Promise<IResponse<IStudent[]>> {
    return new Promise((resolve, reject) => {
      try {
        const results = this.students.data;
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        reject(error);
      }
    })
  }

  getQueriedRecordsByDate(opts: { year: number, month: number }): Promise<IResponse<IRecords[]>> {
    return new Promise((resolve, reject) => {
      this.getAllStudentsRecords(opts)
        .then(res => resolve(res))
        .catch(error => reject(error))
    });
  }


}
