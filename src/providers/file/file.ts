import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { IResponse } from '../../common/interface';

/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileProvider {

  constructor(
    private file: File
  ) { }

  exportFile(opts: {fileName:string, text:string}): Promise<string> {
    let response: IResponse<boolean> = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    for(let prop in this.file){
    }
    return new Promise((resolve, reject) => {
      this.file.writeFile(`${this.file.externalRootDirectory}/Download/`, opts.fileName, opts.text, options)
        .then(res => {
          response = {
            ...response,
            success: true,
            error: res,
            data: res
          };
          resolve(`File Downloaded!`);
        })
        .catch(error => reject(error));
    });
  }


}
