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
        })
    })
  }

  private createTextTabTable(tableRecords: IRecord[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.asyncConcatenate(tableRecords, tableRecords.length)
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  asyncConcatenate(data: IRecord[], length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let value = 'Id\tName\tAttendance\tAbsence\tAttendance %\n';
      try {
        data.length;
      } catch (error) {
        reject(error);
      }
      const interval = setInterval(() => {
        value += `${data[i].id}\t`;
        value += `${data[i].fullName}\t`;
        value += `${data[i].attendance}\t`;
        value += `${data[i].absence}\t`;
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
