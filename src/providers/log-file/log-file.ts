import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { IResponse } from '../../common/interface';
// import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../amaranthus-db/amaranthus-db';

@Injectable()
export class LogFileProvider {

  constructor(private file: File, db: AmaranthusDBProvider) { }

  exportFile(): Promise<string> {
    const fileName = 'attendancelog.txt'
    let response: IResponse<boolean> = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    let text = 'erterte';
    return new Promise((resolve, reject) => {
      this.file.writeFile(`${this.file.dataDirectory}`, fileName, text, options)
        .then(res => {
          response = {
            ...response,
            success: true,
            error: res,
            data: res
          };
          resolve(`${this.file.dataDirectory}${fileName}`);
        })
        .catch(error => reject(error));
    });
  }
}
