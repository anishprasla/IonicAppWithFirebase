import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Import pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { DeviceManagerPage } from '../pages/device-manager/device-manager';
import { DownloadLibraryPage } from '../pages/download-library/download-library';
import { DashboardPage } from '../pages/dashboard/dashboard';


// Import providers
import { AuthData } from '../providers/auth-data';
import { ProfileData } from '../providers/profile-data';
import { UserLicense } from '../providers/user-license';
import { DeviceData } from '../providers/device-data';
import { DeviceDataModel } from '../services/device-data-model';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    DeviceManagerPage,
    DownloadLibraryPage,
    DashboardPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    DeviceManagerPage,
    DownloadLibraryPage,
    DashboardPage
  ],
  providers: [
    [{provide: ErrorHandler, useClass: IonicErrorHandler}],
    AuthData,
    ProfileData,
    UserLicense,
    DeviceData,
    DeviceDataModel
  ]
})
export class AppModule {}

