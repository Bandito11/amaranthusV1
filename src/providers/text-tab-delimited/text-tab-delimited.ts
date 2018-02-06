import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { IResponse } from '../../common/interface';
// import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../amaranthus-db/amaranthus-db';

@Injectable()
export class TextTabDelimitedProvider {

  constructor(private file: File, private db: AmaranthusDBProvider) { }

  exportTextTabDelimited(): Promise<string> {
    const fileName = 'attendancelog.txt'
    let response: IResponse<boolean> = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    const text = this.createTextTabTable();
    for(let prop in this.file){
    }
    return new Promise((resolve, reject) => {
      this.file.writeFile(`${this.file.externalRootDirectory}/Download/`, fileName, text, options)
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

  createTextTabTable(){
    let textTab = 'Id\tName';
    return textTab;
  }

}
