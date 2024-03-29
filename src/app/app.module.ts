import { Market } from '@ionic-native/market';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AmaranthusDBProvider } from '../providers/amaranthus-db/amaranthus-db';
import { Camera } from '@ionic-native/camera';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { CreatePageModule } from '../pages/create/create.module';
import { StudentProfilePageModule } from '../pages/student-profile/student-profile.module';
import { StudentListPageModule } from '../pages/student-list/student-list.module';
import { AppPurchaseProvider } from '../providers/app-purchase/app-purchase';
import { File } from '@ionic-native/file';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TextTabDelimitedProvider } from '../providers/text-tab-delimited/text-tab-delimited';
import { HttpClientModule } from '@angular/common/http';
import { CSVProvider } from '../providers/csv/csv';
import { FileProvider } from '../providers/file/file';
import { XLSXProvider } from '../providers/xslx/xslx';
import { IonicStorageModule } from '@ionic/storage';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';
import { MainPageModule } from '../pages/daily-pages/main/main.module';
import { TablePageModule } from '../pages/daily-pages/table/table.module';
import { CalendarPageModule } from '../pages/daily-pages/calendar/calendar.module';
import { EventsPageModule } from '../pages/events-pages/events/events.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    TabsPageModule,
    MainPageModule,
    TablePageModule,
    CreatePageModule,
    StudentProfilePageModule,
    StudentListPageModule,
    CalendarPageModule,
    SettingsPageModule,
    EventsPageModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  providers: [
    StatusBar,
    SplashScreen,
    AmaranthusDBProvider,
    Camera,
    InAppPurchase,
    File,
    EmailComposer,
    FileOpener,
    Market,
    TextTabDelimitedProvider,
    AppPurchaseProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CSVProvider,
    FileProvider,
    XLSXProvider
  ]
})
export class AppModule { }
