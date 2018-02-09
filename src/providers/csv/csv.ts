import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse, IRecord } from '../../common/interface';

/*
  Generated class for the CsvProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CSVProvider {

  constructor(public http: HttpClient) { }

  exportCSV(tableRecords: IRecord[]): Promise<IResponse<string>> {
    let response: IResponse<string> = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      this.createCSV(tableRecords)
        .then(data => {
          response = {
            ...response,
            success: true,
            data: data
          }
          resolve(response)
        })
        .catch(error => {
          response = {
            ...response,
            error: error
          }
        })
    })
  }

  private createCSV(tableRecords: IRecord[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.asyncConcatenate(tableRecords, tableRecords.length)
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  private asyncConcatenate(data: IRecord[], length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let value = 'Id|Name|Attendance|Absence|Attendance %\n';
      try {
        data.length;
      } catch (error) {
        reject(error);
      }
      const interval = setInterval(() => {
        value += `${data[i].id}|`;
        value += `${data[i].fullName}|`;
        value += `${data[i].attendance}|`;
        value += `${data[i].absence}|`;
        value += `${data[i].percent}\n`;
        i++;
        if (i == length) {
          clearInterval(interval);
          resolve(value);
        }
      }, 500)
    });
  }

}
