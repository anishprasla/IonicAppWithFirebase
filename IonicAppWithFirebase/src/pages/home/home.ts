import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { EventCreatePage } from '../event-create/event-create';
import { EventListPage } from '../event-list/event-list';
import { DeviceManagerPage } from '../device-manager/device-manager';
import { DownloadLibraryPage } from '../download-library/download-library';
import { DashboardPage } from '../dashboard/dashboard';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
   
  constructor(public navCtrl: NavController) {
      
  }

  goToProfile(){
    this.navCtrl.push(ProfilePage);
  }

  goToCreate(){
    this.navCtrl.push(EventCreatePage);
  }

  goToList(){
    this.navCtrl.push(EventListPage);
  }

  goToLibrary(){
    this.navCtrl.push(DownloadLibraryPage);
  }

  goToDeviceList(){
    this.navCtrl.push(DeviceManagerPage);
  }
goToDashboard(){
    this.navCtrl.push(DashboardPage);
  }


}
