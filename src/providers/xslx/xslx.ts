import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRecord, IResponse } from '../../common/interface';
import * as XLSX from 'xlsx';

/*
  Generated class for the XslxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class XLSXProvider {

  constructor(public http: HttpClient) {}

  exportXLSXToFile(tableRecords: IRecord[]): Promise<IResponse<Blob>> {
    let response: IResponse<Blob> = {
      success: false,
      error: null,
      data: undefined
    }
    return new Promise((resolve, reject) => {
      this.createXLSX(tableRecords)
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
        });
    });
  }

  private createXLSX(tableRecords): Promise<Blob> {
    return new Promise((resolve, reject) => {
      /* generate worksheet */
      this.asyncConcatenate(tableRecords, tableRecords.length)
        .then(data => {
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Students Attendance Records');
          /* save to file */
          // XLSX.writeFile(wb, 'AttendanceLog.xlsx');
          /* save to file */
          const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          let blob = new Blob([wbout], { type: 'application/octet-stream' });
          resolve(blob);
        })
    });
  }

  private asyncConcatenate(data: IRecord[], length: number): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let studentsRecords: any[][] = [['Id', 'Name', 'Attendance', 'Absence', 'Attendance %']];
      try {
        data.length;
      } catch (error) {
        reject(error);
      }
      const interval = setInterval(() => {
        studentsRecords = [...studentsRecords, [data[i].id, data[i].fullName, data[i].attendance, data[i].absence, data[i].percent]];
        i++;
        if (i == length) {
          clearInterval(interval);
          resolve(studentsRecords);
        }
      }, 500)
    });
  }

}
