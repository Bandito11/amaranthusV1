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
      try {
        const data = this.createCSV(tableRecords);
        response = {
          ...response,
          success: true,
          data: data
        };
        resolve(response);
      } catch (error) {
        response = {
          ...response,
          error: error
        }
        reject(error);
      };
    })
  }

  private createCSV(tableRecords : IRecord[]) : string {
    let value = 'Id|Name|Attendance|Absence|Attendance %\n';
    try {
      tableRecords.length;
    } catch (error) {
      return 'There are no students created!';
    }
    tableRecords.map(tableRecord => {
      value += `${tableRecord.id}|`;
      value += `${tableRecord.fullName}|`;
      value += `${tableRecord.attendance}|`;
      value += `${tableRecord.absence}|`;
      value += `${tableRecord.percent}\n`;
    });
    return value;
  }

}
