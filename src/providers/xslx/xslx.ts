import {Injectable} from '@angular/core';
import {IRecord, IResponse} from '../../common/interface';
import * as XLSX from 'xlsx';

@Injectable()
export class XLSXProvider {

  constructor() {}

  exportXLSXToFile(tableRecords : IRecord[]) : Promise < IResponse < Blob >> {
    let response: IResponse < Blob > = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      try {
        const data = this.createXLSX(tableRecords);
        response = {
          ...response,
          success: true,
          data: data
        }
        resolve(response)
      } catch (error) {
        response = {
          ...response,
          error: error
        }
        reject(error);
      };
    });
  }

  private createXLSX(tableRecords) : Blob | any {
    /* generate worksheet */
    let studentsRecords: any[][] = [
      ['Id', 'Name', 'Attendance', 'Absence', 'Attendance %']
    ];
    try {
      tableRecords.length;
    } catch (error) {
      return 'There are no students created!';
    }
    tableRecords.map(tableRecord => {
      studentsRecords = [
        ...studentsRecords,
        [tableRecord.id, tableRecord.fullName, tableRecord.attendance, tableRecord.absence, tableRecord.percent]
      ];
      const ws : XLSX.WorkSheet = XLSX
        .utils
        .aoa_to_sheet(studentsRecords);
      /* generate workbook and add the worksheet */
      const wb : XLSX.WorkBook = XLSX
        .utils
        .book_new();
      XLSX
        .utils
        .book_append_sheet(wb, ws, 'Students Attendance Records');
      /* save to file */
      // XLSX.writeFile(wb, 'AttendanceLog.xlsx');
      /* save to file */
      const wbout : ArrayBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
      });
      let blob = new Blob([wbout], {type: 'application/octet-stream'});
      return blob;
    });
  }
}
