import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/*
  Generated class for the Table2excelProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Table2excelProvider {

  constructor(private http: HttpClient) { }

  private file = 'assets/files/file.txt'

  
  exportSpreadSheetToFile(): string {
    const body = encodeURIComponent(`ID\tNAME`);
    const href = `data:text/csv;charset=utf-8,${body}`
    return href;
  }

  getData(){

  }
}
