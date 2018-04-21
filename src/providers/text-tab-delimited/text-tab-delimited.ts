import { Injectable } from '@angular/core';
import { IResponse, IRecord } from '../../common/interface';

@Injectable()
export class TextTabDelimitedProvider {

  constructor() { }

  exportTextTabDelimited(tableRecords: IRecord[]): Promise<IResponse<string>> {
    let response: IResponse<string> = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      this.createTextTabTable(tableRecords)
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
        });
    });
  }

  private createTextTabTable(tableRecords: IRecord[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let value = 'Id\tName\tAttendance\tAbsence\tAttendance %\n';
      let length;
      try {
        length = tableRecords.length;
      } catch (error) {
        reject(error);
      }
      const interval = setInterval(() => {
        value += `${tableRecords[i].id}\t`;
        value += `${tableRecords[i].fullName}\t`;
        value += `${tableRecords[i].attendance}\t`;
        value += `${tableRecords[i].absence}\t`;
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
