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
import { AppPurchaseProvider } from '../providers/app-purchase/app-purchase';
// import { File } from '@ionic-native/file';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { ComponentsModule } from '../components/components.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { SettingsPage } from '../pages/settings/settings';

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
    ComponentsModule,
    SettingsPageModule,
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
    CalendarPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AmaranthusDBProvider,
    Camera,
    InAppPurchase2,
    // File,
    // LogFileProvider,
    AppPurchaseProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
