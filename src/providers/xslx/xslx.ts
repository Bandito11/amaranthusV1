import { Injectable } from '@angular/core';
import { IRecord, IResponse } from '../../common/interface';
import * as XLSX from 'xlsx';

@Injectable()
export class XLSXProvider {

  constructor() { }

  async exportXLSXToFile(tableRecords: IRecord[]): Promise<IResponse<Blob>> {
    let response: IResponse<Blob> = {
      success: false,
      error: null,
      data: undefined
    }
    try {
      const data = await this.createXLSX(tableRecords);
      response = {
        ...response,
        success: true,
        data: data
      }
      return response;
    } catch (error) {
      response = {
        ...response,
        error: error
      }
      return error;
    };
  }

  private createXLSX(tableRecords):Promise<Blob> {
    return new Promise((resolve, reject) => {
      /* generate worksheet */
      let studentsRecords: any[][] = [
        ['Id', 'Name', 'Attendance', 'Absence', 'Attendance %']
      ];
      try {
        tableRecords.length;
      } catch (error) {
        reject('There are no students created in database!');
      }
      tableRecords.map(tableRecord => {
        studentsRecords = [
          ...studentsRecords,
          [tableRecord.id, tableRecord.fullName, tableRecord.attendance, tableRecord.absence, tableRecord.percent]
        ];
        const ws: XLSX.WorkSheet = XLSX
          .utils
          .aoa_to_sheet(studentsRecords);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students Attendance Records');
        const wbout: ArrayBuffer = XLSX.write(wb, {
          bookType: 'xlsx',
          type: 'array'
        });
        let blob = new Blob([wbout], { type: 'application/octet-stream' });
        resolve(blob);
      });
    });
  }
}
