import {Injectable} from '@angular/core';
import {IResponse, IRecord} from '../../common/interface';

@Injectable()
export class TextTabDelimitedProvider {

  constructor() {}

  exportTextTabDelimited(tableRecords : IRecord[]) : IResponse < string > {
    let response: IResponse < string > = {
      success: false,
      error: null,
      data: undefined
    }
      try {
        const data = this.createTextTabTable(tableRecords)
        response = {
          ...response,
          success: true,
          data: data
        };
        return response;
      } catch (error) {
        response = {
          ...response,
          error: error
        }
        return error;
      };
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
