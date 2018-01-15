import { StudentProfilePage } from './../pages/student-profile/student-profile';
import { StudentListPage } from './../pages/student-list/student-list';
import { PhoneNumberPipe } from './../common/phonenumber.pipe';
import { TabsPage } from '../pages/tabs/tabs';
import { MainPage } from '../pages/main/main';
import { TablePage } from '../pages/table/table';
import { EditPage } from './../pages/edit/edit';
import { CreatePage } from './../pages/create/create';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AmaranthusDBProvider } from '../providers/amaranthus-db/amaranthus-db';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import {CalendarComponent} from './../components/calendar/calendar';
import { CalendarPage } from '../pages/calendar/calendar';
import { LogFileProvider } from '../providers/log-file/log-file';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    MainPage,
    TablePage,
    EditPage,
    CreatePage,
    PhoneNumberPipe,
    StudentProfilePage,
    StudentListPage,
    CalendarPage,
    CalendarComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    MainPage,
    TablePage,
    EditPage,
    CreatePage,
    StudentProfilePage,
    StudentListPage,
    CalendarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AmaranthusDBProvider,
    Camera,
    File,
    LogFileProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
