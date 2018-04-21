import {Injectable} from '@angular/core';
import {IResponse, IRecord} from '../../common/interface';

@Injectable()
export class TextTabDelimitedProvider {

  constructor() {}

  exportTextTabDelimited(tableRecords : IRecord[]) : Promise < IResponse < string >> {
    let response: IResponse < string > = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      try {
        const data = this.createTextTabTable(tableRecords)
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
    });
  }

  private createTextTabTable(tableRecords : IRecord[]) : string {
    let value = 'Id\tName\tAttendance\tAbsence\tAttendance %\n';
    try {
      tableRecords.length;
    } catch (error) {
      return 'There are no students created!';
    }
    tableRecords.map(tableRecord => {
      value += `${tableRecord.id}\t`;
      value += `${tableRecord.fullName}\t`;
      value += `${tableRecord.attendance}\t`;
      value += `${tableRecord.absence}\t`;
      value += `${tableRecord.percent}\n`;
    });
    return value;
  }
}
