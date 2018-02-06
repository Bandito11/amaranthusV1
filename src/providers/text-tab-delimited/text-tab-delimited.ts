import { Injectable } from '@angular/core';
import { IResponse } from '../../common/interface';
// import { handleError } from '../../common/handleError';
import { AmaranthusDBProvider } from '../amaranthus-db/amaranthus-db';
import { FileProvider } from '../file/file';

@Injectable()
export class TextTabDelimitedProvider {

  constructor(private file: FileProvider) { }

  exportTextTabDelimited() {
    
  }

  createTextTabTable(): Promise<string>{
    return new Promise((resolve,reject)=>{
    let textTabDelimitedRecords = 'Id\tName';
      resolve(textTabDelimitedRecords)
    });
  }

}
