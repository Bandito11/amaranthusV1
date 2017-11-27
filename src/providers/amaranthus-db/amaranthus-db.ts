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
  students: LokiCollection<{}>;
  records: LokiCollection<{}>;

  createDB() {
    const ldbAdapter = new IonicStorageAdapter();
    const dbOptions: LokiConfigureOptions = {
      autosave: true,
      autoload: true,
      adapter: ldbAdapter
    }
    this.db = new Loki('amaranthus.db', dbOptions);
    this.students = this.db.addCollection('students');
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
    this.oldStudentsData.data.map(student => this.insertStudent(student))
  }
  devInsertRecordsIntoDb() {
    this.oldRecordsData.data.map(record => this.records.insert(record));
  }


  ///////////////////////////

  checkIfUserExists(opts: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let results: any = this.students.findOne({
          'student.id': { '$eq': opts.id }
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
              this.students.insert({ student });
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
        let results: any = this.records.findOne({
          'record.id': { '$eq': record.id },
          'record.month': { '$eq': record.month },
          'record.year': { '$eq': record.year },
          'record.day': { '$eq': record.day }
        });
        if (results) {
          results.record = { ...record };
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
          'student.id': { '$eq': student.id }
        });
        results.student = { ...student };
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
          'student.id': { '$eq': student.id }
        });
        this.students.remove(results);
        this.saveDatabase();
        resolve({ success: true, error: null, data: null })
      } catch (error) {
        reject(error)
      }
    });
  }

  getStudentById(student: IStudent): Promise<IResponse<any>> {
    return new Promise((resolve, reject) => {
      try {
        const results: any = this.students.findOne({
          'student.id': { '$eq': student.id }
        });
        const queriedStudent = results.student;
        resolve({ success: true, error: null, data: queriedStudent });
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
      }
    });
  }

  getAllStudentsRecords(opts: { year: number, month: number }): Promise<IResponse<any>> {
    let response: IResponse<any> = { success: true, error: null, data: [] };
    let attendance: number;
    let absence: number;
    return new Promise((resolve, reject) => {
      try {
        const students = this.students.find({
          'student.isActive': { '$eq': true }
        });
        students.map((data: any) => {
          attendance = 0;
          absence = 0;
          const records = this.records.find({
            'id': { '$eq': data.student.id },
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
                id: data.student.id,
                name: `${data.student.firstName} ${data.student.lastName}`,
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
        const results = this.students.find({ 'student.isActive': { '$eq': true } });
        resolve({ success: true, error: null, data: results });
      } catch (error) {
        reject(error);
      }
    })
  }

  // query by isActive
  getAllStudents(): Promise<IResponse<any>> {
    return new Promise((resolve, reject) => {
      try {
        const results = this.students.find({});
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
