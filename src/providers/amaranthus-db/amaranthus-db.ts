import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/retry';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap, retry } from 'rxjs/operators';
/*
  Generated class for the AmaranthusDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AmaranthusDBProvider {

  constructor(private http: HttpClient) {
    console.log('Hello AmaranthusDbProvider Provider');
    this.createDB();
  }
  
getAllStudents(){
  return this.http.get('./assets/mock-students.json')
  .pipe(
      catchError(this.handleError('getHeroes'))
    );
}

handleError(error){
  console.error(error);
}

createDB(){}
}
