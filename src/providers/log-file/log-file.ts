import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { IResponse } from '../../common/interface';
// import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../amaranthus-db/amaranthus-db';

@Injectable()
export class LogFileProvider {

  constructor(private file: File, db: AmaranthusDBProvider) { }

  exportFile() {
    let response: IResponse<boolean> = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    let text = 'erterte';
    this.file.writeFile(`${this.file.dataDirectory}`, 'attendancelog.txt', text, options)
        .then(res => {
          response = {
            ...response,
            success: true,
            error: res,
            data: res
          };
          console.log('File saved!');
    });

    // this.file.checkDir(this.file.dataDirectory, 'attendanceLog')
    // .then(dir => {console.log(dir)
    //   if(dir == true){
    //     this.file.writeFile(`${this.file.dataDirectory}/attendanceLog`, 'attendancelog.txt', text, options)
    //     .then(res => {
    //       response = {
    //         ...response,
    //         success: true,
    //         error: res,
    //         data: res
    //       };
    //       console.log('File saved!');
    //     });
    //   }
    // })
    // .catch(err => {
    //   for (let prop in err){
    //     if(prop || prop != '1'){
    //       console.log(err[prop]);
    //     }
    //   }
    //    this.file.createDir(this.file.dataDirectory, `attendanceLog`, true)
    //         .then(newDir => {console.log(newDir.fullPath)
    //           this.file.writeFile(`${this.file.dataDirectory}${newDir.fullPath}`, 'attendancelog.txt', text, options)
    //             .then(res => {
    //               response = {
    //                 ...response,
    //                 success: true,
    //                 error: res,
    //                 data: res
    //               };
    //               console.log('File saved!');
    //             });
    //         });
    // });
  }

  createExportRecord() {

  }
}
