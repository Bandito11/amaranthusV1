import {Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {File, IWriteOptions} from '@ionic-native/file';
import {IResponse} from '../../common/interface';
import {FileOpener} from '@ionic-native/file-opener';

@Injectable()
export class FileProvider {

  constructor(private fileOpener : FileOpener, private file : File, private platform : Platform) {}

  exportFile(opts : {
    fileName: string,
    text: any,
    type: string
  }) : Promise < IResponse < any >> {
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
    const directory = '/Download/';
    const path = this.file.externalRootDirectory + directory;
    return new Promise((resolve, reject) => {
      this
        .file
        .writeFile(path, opts.fileName, opts.text, options)
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
    text: any,
    type: string
  }) : Promise < IResponse < any >> {
    let response: IResponse < boolean > = {
      success: false,
      error: '',
      data: false
    };
    const options: IWriteOptions = {
      replace: true
    };
    const path = this.file.documentsDirectory;
    const directory = 'Attendance Log';
    return new Promise((resolve, reject) => {
      this
        .file
        .checkDir(path, directory)
        .then(res => {
          this
            .file
            .writeFile(path + directory, opts.fileName, opts.text, options)
            .then(res => {
              response = {
                ...response,
                success: true,
                error: res,
                data: res
              };
              if (opts.type == 'xlsx') {
                this
                  .fileOpener
                  .open(`${path}${directory}/${opts.fileName}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                  .then(() => resolve(response))
                  .catch(error => reject(error));
              }
              if (opts.type == 'txt') {
                this
                  .fileOpener
                  .open(`${path}${directory}/${opts.fileName}`, 'text/plain')
                  .then(() => resolve(response))
                  .catch(error => reject(error));
              }
              if (opts.type == 'csv') {
                this
                  .fileOpener
                  .open(`${path}${directory}/${opts.fileName}`, 'text/csv')
                  .then(() => resolve(response))
                  .catch(error => reject(error));
              }
            })
            .catch(error => reject(error));
        })
        .catch(() => {
          this
            .file
            .createDir(path, directory, true)
            .then(directory => {
              this
                .file
                .writeFile(path + directory.name, opts.fileName, opts.text, options)
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
            })
            .catch(error => reject(error));
        });
    });
  }
}
