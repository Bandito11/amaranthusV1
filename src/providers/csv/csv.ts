import {Injectable} from '@angular/core';
import {IResponse, IRecord} from '../../common/interface';

/*
  Generated class for the CsvProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CSVProvider {

  constructor() {}

  exportCSV(tableRecords : IRecord[]) : Promise < IResponse < string >> {
    let response: IResponse < string > = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      this
        .createCSV(tableRecords)
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
          reject(error);
        })
    })
  }

  private createCSV(tableRecords : IRecord[]) : Promise < string > {
    return new Promise((resolve, reject) => {
      let i = 0;
      let value = 'Id|Name|Attendance|Absence|Attendance %\n';
      let length;
      try {
        length = tableRecords.length;
      } catch (error) {
        reject(error);
      }
      const interval = setInterval(() => {
        value += `${tableRecords[i].id}|`;
        value += `${tableRecords[i].fullName}|`;
        value += `${tableRecords[i].attendance}|`;
        value += `${tableRecords[i].absence}|`;
        value += `${tableRecords[i].percent}\n`;
        i++;
        if (i == length) {
          clearInterval(interval);
          resolve(value);
        }
      }, 500);
    });
  }

}
