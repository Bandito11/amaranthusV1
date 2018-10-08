import { Storage } from '@ionic/storage';
import { IStudent, IResponse, IRecord, ICalendar, IEvent, INote } from '../../common/models';
import { Injectable } from '@angular/core';
import { IonicStorageAdapter } from './adapter';
import * as Loki from 'lokijs';
import { handleError } from '../../common/handleError';
import { trimText, trimEvent } from '../../common/formatToText';

/**
 * Collections use on db
 */
let studentsColl: Collection<IStudent>;
let recordsColl: Collection<IRecord>;
let eventsColl: Collection<IEvent>;
let notesColl: Collection<INote>;

/**
 * Declaration of DB
 */
let amaranthusDB: Loki;

@Injectable()
export class AmaranthusDBProvider {
  constructor(private storage: Storage) {
    this.createDB();
  }

  private createDB() {
    const ionicStorageAdapter = new IonicStorageAdapter();
    const lokiOptions: Partial<LokiConfigOptions> = {
      autosave: true,
      autoload: true,
      adapter: ionicStorageAdapter,
      autoloadCallback: this.loadDatabase
    };
    amaranthusDB = new Loki('amaranthus.db', lokiOptions);
  }

  private loadDatabase() {
    studentsColl = amaranthusDB.getCollection<IStudent>('students');
    recordsColl = amaranthusDB.getCollection<IRecord>('records');
    eventsColl = amaranthusDB.getCollection<IEvent>('events');
    notesColl = amaranthusDB.getCollection<INote>('notes');
    if (!studentsColl) {
      studentsColl = amaranthusDB.addCollection<IStudent>('students');
    }
    if (!recordsColl) {
      recordsColl = amaranthusDB.addCollection<IRecord>('records');
    }
    if (!eventsColl) {
      eventsColl = amaranthusDB.addCollection<IEvent>('events');
    }
    if (!notesColl) {
      notesColl = amaranthusDB.addCollection<INote>('notes');
    }
  }

  getNoteByDate(opts: { date: ICalendar; id: string }) {
    let response: IResponse<INote> = {
      success: false,
      error: null,
      data: undefined
    };
    const results: any = notesColl.findOne({
      id: {
        $eq: opts.id
      },
      month: {
        $eq: opts.date.month
      },
      year: {
        $eq: opts.date.year
      },
      day: {
        $eq: opts.date.day
      }
    });
    if (results) {
      response = {
        ...response,
        success: true,
        data: results
      };
      return response;
    } else {
      response = {
        ...response,
        error: 'Error retrieving notes. Please try again!',
        data: null
      };
      return response;
    }
  }

  getNoteById(id: string) {
    let response: IResponse<INote> = {
      success: false,
      error: null,
      data: undefined
    };
    const results = notesColl.findOne({
      id: id
    });
    if (results) {
      response = {
        ...response,
        success: true,
        data: results
      };
      return response;
    } else {
      response = {
        ...response,
        error: 'Error retrieving notes. Please try again!',
        data: null
      };
      return response;
    }
  }

  getAllNotesById(id: string) {
    let response: IResponse<INote[]> = {
      success: false,
      error: null,
      data: undefined
    };
    const results = notesColl
      .chain()
      .find({
        id: id
      })
      .simplesort('day')
      .simplesort('month')
      .simplesort('year')
      .data();
    if (results) {
      response = {
        ...response,
        success: true,
        data: [...results]
      };
      return response;
    } else {
      response = {
        ...response,
        error: 'Error retrieving notes. Please try again!',
        data: null
      };
      return response;
    }
  }

  getNotes() {
    return notesColl.data;
  }

  insertNotes(note: INote) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      const results: any = notesColl.findOne({
        id: {
          $eq: note.id
        },
        month: {
          $eq: note.month
        },
        year: {
          $eq: note.year
        },
        day: {
          $eq: note.day
        }
      });
      if (!results) {
        notesColl.insert(note);
      } else {
        const newNote = {
          ...results,
          ...note
        };
        notesColl.update(newNote);
      }
      response = { ...response, success: true };
      return response;
    } catch (error) {
      response = { ...response, error: error };
      return response;
    }
  }

  insertEvent(event: IEvent) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      const formattedEvent = trimEvent(event);
      eventsColl.insert(formattedEvent);
      response = { ...response, success: true };
      return response;
    } catch (error) {
      response = { ...response, error: error };
      return response;
    }
  }

  removeEvent(event: IEvent & LokiObj) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      let results: any = eventsColl.findOne({
        $loki: {
          $eq: event.$loki
        }
      });
      eventsColl.remove(results);
      return { ...response, success: true };
    } catch (error) {
      return { ...response, error: error };
    }
  }

  updateEvent(event: IEvent & LokiObj) {
    try {
      let results: any = eventsColl.findOne({
        $loki: {
          $eq: event.$loki
        }
      });
      if (results) {
        eventsColl.update(event);
        return {
          success: true,
          error: null,
          data: null
        };
      } else {
        return {
          success: false,
          error: "User doesn't exist on Database",
          data: null
        };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  getEvents() {
    let response: IResponse<IEvent[]> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      const results: any = eventsColl
        .chain()
        .simplesort('startDate', true)
        .data();
      response = {
        ...response,
        success: true,
        data: results
      };
      return response;
    } catch (error) {
      response = {
        ...response,
        error: error
      };
      return response;
    }
  }

  getEvent(id) {
    let response: IResponse<IEvent & LokiObj> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      let results = eventsColl.findOne({
        $loki: {
          $eq: id
        }
      });
      response = {
        ...response,
        success: true,
        data: results
      };
      return response;
    } catch (error) {
      response = {
        ...response,
        error: error
      };
      return response;
    }
  }

  checkIfStudentExists(opts: { id: string }) {
    try {
      let results = studentsColl.findOne({
        id: {
          $eq: opts.id
        }
      });
      if (results) {
        return true;
      } else {
        return false;
      }
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
    const value = this.checkIfStudentExists({ id: student.id });
    try {
      if (value == false) {
        const formattedStudent = trimText(student);
        studentsColl.insert(formattedStudent);
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
      };
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
        this.storage.get('boughtMasterKey').then(boughtMasterKey => {
          if (boughtMasterKey == true) {
            response = {
              ...response,
              ...this.insertStudentIntoDB(student)
            };
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
        });
      } else {
        response = {
          ...response,
          ...this.insertStudentIntoDB(student)
        };
        if (response.success) {
          resolve(response);
        }
        reject(response);
      }
    });
  }

  updateStudent(student: IStudent): IResponse<null> {
    try {
      let results: any = studentsColl.findOne({
        id: {
          $eq: student.id
        }
      });
      const formattedStudent = trimText(student);
      results = {
        ...results,
        ...formattedStudent
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

  removeStudent(student: IStudent): IResponse<null> {
    try {
      let results: any = studentsColl.findOne({
        id: {
          $eq: student.id
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

  addAbsence(opts: { date: ICalendar; id: string; event?: string }): IResponse<null> {
    let response;
    if (opts['event']) {
      response = this.insertOrUpdateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: false,
        absence: true,
        event: opts.event
      });
    } else {
      response = this.insertOrUpdateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: false,
        absence: true
      });
    }
    return response;
  }

  addAttendance(opts: { date: ICalendar; id: string; event?: string }): IResponse<null> {
    let response;
    if (opts['event']) {
      response = this.insertOrUpdateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: true,
        absence: false,
        event: opts.event
      });
    } else {
      response = this.insertOrUpdateRecord({
        ...opts,
        date: {
          ...opts.date,
          month: opts.date.month + 1
        },
        attendance: true,
        absence: false
      });
    }
    return response;
  }

  insertOrUpdateRecord(opts: { attendance: boolean; absence: boolean; date: ICalendar; id: string; event?: string }) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      let record: IRecord = {
        id: opts.id,
        month: opts.date.month,
        year: opts.date.year,
        day: opts.date.day,
        attendance: opts.attendance,
        absence: opts.absence,
        event: ''
      };
      let results;
      if (opts['event']) {
        record = {
          ...record,
          event: opts.event
        };
        results = recordsColl.findOne({
          id: {
            $eq: record.id
          },
          month: {
            $eq: record.month
          },
          year: {
            $eq: record.year
          },
          day: {
            $eq: record.day
          },
          event: {
            $eq: opts.event
          }
        });
      } else {
        results = recordsColl.findOne({
          id: {
            $eq: record.id
          },
          month: {
            $eq: record.month
          },
          year: {
            $eq: record.year
          },
          day: {
            $eq: record.day
          },
          event: {
            $eq: ''
          }
        });
      }
      if (results) {
        let foundRecord = {
          ...results,
          ...record
        };
        recordsColl.update(foundRecord);
      } else {
        let newRecord = {
          ...record
        };
        recordsColl.insert(newRecord);
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
        };
        return response;
      }
    }
  }

  getStudentById(student: IStudent): IResponse<IStudent & LokiObj> {
    let response: IResponse<IStudent & LokiObj> = {
      success: false,
      error: null,
      data: undefined
    };
    try {
      const results = studentsColl.findOne({
        id: {
          $eq: student.id
        }
      });
      const noteResponse = this.getNoteById(results.id);
      let studentFound = {
        ...results
      };
      if (noteResponse.success) {
        studentFound = {
          ...studentFound,
          notes: noteResponse.data.notes
        };
      }
      response = {
        ...response,
        success: true,
        error: null,
        data: studentFound
      };
      return response;
    } catch (error) {
      if (studentsColl) {
        return error;
      }
    }
  }

  getQueriedRecords(opts: { event?: string; query: string; date?: ICalendar }): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: null
    };
    // TODO: Add Event if condition!!!!
    switch (opts.query) {
      case 'Date':
        this.getQueriedRecordsByDate(<any>opts);
        break;
      default:
        const date: ICalendar = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: null
        };
        let options = {
          date: date,
          event: ''
        }
        if(opts['event']){
          options = {
            ...options,
            event: opts.event
          }
        }
        try {
          response = {
            ...response,
            ...this.getAllStudentsRecords(options)
          };
          return response;
        } catch (error) {
          return error;
        }
    }
  }

  getStudentsRecordsByDate(opts: { date: ICalendar; event?: string }): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: []
    };
    try {
      const students = studentsColl.find({
        isActive: {
          $eq: true
        }
      });
      let studentRecord;
      let record;
      students.map((student: IStudent) => {
        studentRecord = null;
        record = null;
        if (opts['event']) {
          record = recordsColl.findOne({
            id: {
              $eq: student.id
            },
            year: {
              $eq: opts.date.year
            },
            month: {
              $eq: opts.date.month
            },
            day: {
              $eq: opts.date.day
            },
            event: {
              $eq: opts.event
            }
          });
        } else {
          record = recordsColl.findOne({
            id: {
              $eq: student.id
            },
            year: {
              $eq: opts.date.year
            },
            month: {
              $eq: opts.date.month
            },
            day: {
              $eq: opts.date.day
            },
            event: {
              $eq: ''
            }
          });
        }
        const noteDate = {
          ...opts.date,
          month: opts.date.month - 1
        };
        const noteResponse = this.getNoteByDate({
          id: student.id,
          date: noteDate
        });
        if (noteResponse.success) {
          studentRecord = { notes: noteResponse.data.notes };
        } else {
          studentRecord = { notes: '' };
        }
        if (record) {
          if (student.id == record.id) {
            studentRecord = {
              ...studentRecord,
              firstName: student.firstName,
              lastName: student.lastName,
              fullName: `${student.firstName} ${student.lastName}`,
              picture: student.picture,
              attendance: record.attendance,
              absence: record.absence,
              id: student.id
            };
            response = {
              ...response,
              data: [...response.data, studentRecord]
            };
          }
        } else {
          studentRecord = {
            ...studentRecord,
            firstName: student.firstName,
            lastName: student.lastName,
            fullName: `${student.firstName} ${student.lastName}`,
            picture: student.picture,
            attendance: false,
            absence: false,
            id: student.id
          };
          response = {
            ...response,
            data: [...response.data, studentRecord]
          };
        }
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

  getAllStudentsRecords(opts: { event?: string; date: ICalendar }): IResponse<IRecord[]> {
    let response = {
      success: true,
      error: null,
      data: []
    };
    let attendance: number;
    let absence: number;
    try {
      const students = studentsColl.find({
        isActive: {
          $eq: true
        }
      });
      students.map((student: IStudent) => {
        attendance = 0;
        absence = 0;
        let records;
        if (opts['event']) {
          records = recordsColl.find({
            id: {
              $eq: student.id
            },
            year: {
              $eq: opts.date.year
            },
            month: {
              $eq: opts.date.month
            },
            event: {
              $eq: opts.event
            }
          });
        } else {
          records = recordsColl.find({
            id: {
              $eq: student.id
            },
            year: {
              $eq: opts.date.year
            },
            month: {
              $eq: opts.date.month
            },
            event: {
              $eq: ''
            }
          });
        }
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
            percent = ((100 * attendance) / (attendance + absence)).toFixed(2);
          }
          if (percent) {
            response = {
              ...response,
              data: [
                ...response.data,
                {
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
                ...response.data,
                {
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
        }
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
      const students = studentsColl.data;
      response = {
        ...response,
        success: true,
        data: [...students]
      };
      return response;
    } catch (error) {
      if (!studentsColl) {
        response.error = error;
        return response;
      }
    }
  }

  getQueriedRecordsByDate(opts: { event?: string; date: ICalendar }): IResponse<IRecord[]> {
    try {
      return this.getAllStudentsRecords(opts);
    } catch (error) {
      return error;
    }
  }

  // query by isActive
  getAllActiveStudents(date: ICalendar): IResponse<IStudent[]> {
    try {
      const students = studentsColl.find({
        isActive: {
          $eq: true
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
        const note = this.getNoteByDate({
          id: student.id,
          date: {
            ...date,
            month: date.month - 1
          }
        });
        let newStudent = {
          ...student,
          attendance: false,
          absence: false,
          notes: null
        };
        if (record != null && record.id == student.id) {
          newStudent = {
            ...newStudent,
            attendance: record.attendance,
            absence: record.absence
          };
        }
        if (note.success) {
          newStudent = {
            ...newStudent,
            notes: note.data.notes
          };
        }
        return newStudent;
      }); // got results
      return { success: true, error: null, data: results };
    } catch (error) {
      if (!studentsColl) {
        return error;
      }
    }
  }

  getQueriedRecordsByCurrentDate(opts: { event?: string; studentId: string; day: number; year: number; month: number }): IRecord {
    let response: IRecord;
    try {
      let recordQuery;
      if (opts['event']) {
        recordQuery = recordsColl.findOne({
          id: {
            $eq: opts.studentId
          },
          year: {
            $eq: opts.year
          },
          day: {
            $eq: opts.day
          },
          month: {
            $eq: opts.month
          },
          event: {
            $eq: opts.event
          }
        });
      } else {
        recordQuery = recordsColl.findOne({
          id: {
            $eq: opts.studentId
          },
          year: {
            $eq: opts.year
          },
          day: {
            $eq: opts.day
          },
          month: {
            $eq: opts.month
          },
          event: {
            $eq: ''
          }
        });
      }

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
