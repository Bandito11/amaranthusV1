import {Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {File, IWriteOptions} from '@ionic-native/file';
import {IResponse} from '../../common/interface';

@Injectable()
export class FileProvider {

  constructor(private file : File, private platform : Platform) {}

  exportFile(opts : {
    fileName: string,
    text: any
  }) : Promise < IResponse < any >> {
    const options: IWriteOptions = {
      replace: true
    };
    return new Promise((resolve, reject) => {
      if (this.platform.is('ios')) {
        this
          .writeToIOS(opts)
          .then(response => resolve(response))
          .catch(error => reject(error));
      }
      if (this.platform.is('android')) {
        this
          .writeToAndroid(opts)
          .then(response => resolve(response))
          .catch(error => reject(error));
      }
    });
  }

  writeToAndroid(opts : {
    fileName: string,
    text: any
  }) : Promise < IResponse < any >> {
    let response: IResponse < boolean > = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    return new Promise((resolve, reject) => {
      this
        .file
        .writeFile(`${this.file.externalRootDirectory}/Download/`, opts.fileName, opts.text, options)
        .then(res => {
          response = {
            ...response,
            success: true,
            error: res,
            data: res
          };
          resolve(response);
        })
        .catch(error => reject(error));
    });
  }

  writeToIOS(opts : {
    fileName: string,
    text: any
  }) : Promise < IResponse < any >> {
    let response: IResponse < boolean > = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    return new Promise((resolve, reject) => {
      this
        .file
        .writeFile(this.file.documentsDirectory, opts.fileName, opts.text, options)
        .then(res => {
          response = {
            ...response,
            success: true,
            error: res,
            data: res
          };
          resolve(response);
        })
        .catch(error => reject(error));
    });
  }
}
