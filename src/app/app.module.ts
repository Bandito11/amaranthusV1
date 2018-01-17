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
import { CalendarPage } from '../pages/calendar/calendar';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { MainPageModule } from '../pages/main/main.module';
import { TablePageModule } from '../pages/table/table.module';
import { EditPageModule } from '../pages/edit/edit.module';
import { CreatePageModule } from '../pages/create/create.module';
import { StudentProfilePageModule } from '../pages/student-profile/student-profile.module';
import { StudentListPageModule } from '../pages/student-list/student-list.module';
import { CalendarPageModule } from '../pages/calendar/calendar.module';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { AppPurchaseProvider } from '../providers/app-purchase/app-purchase';

@NgModule({
  declarations: [
    MyApp,
    PhoneNumberPipe
    ],
  imports: [
    TabsPageModule,
    MainPageModule,
    TablePageModule,
    EditPageModule,
    CreatePageModule,
    StudentProfilePageModule,
    StudentListPageModule,
    CalendarPageModule,
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp)
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
    // File,
    InAppPurchase,
    // LogFileProvider,
    AppPurchaseProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
