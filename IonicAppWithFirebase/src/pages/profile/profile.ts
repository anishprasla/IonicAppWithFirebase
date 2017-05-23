import { NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { DeviceData } from '../../providers/device-data';
import { Device } from 'ionic-native';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  public appPackageName: string;
  public deviceList: any;
  constructor(public nav: NavController, public profileData: ProfileData, public deviceData: DeviceData,
    public authData: AuthData, public alertCtrl: AlertController) {
    this.deviceData = deviceData;
    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.appPackageName = data.val().appPackage.replace("-", ".");
      this.appPackageName = this.appPackageName.replace("-", ".");
      this.birthDate = this.userProfile.birthDate;
    });
    this.deviceData.getAdminDeviceList().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        if (snap.val().email == this.userProfile.email) {
          rawList.push({
            id: snap.key,
            uuid: snap.val().deviceUUID,
            model: snap.val().devicemodel,
            manufacturer: snap.val().devicemanufacturer,
          });
        }
      });
      this.deviceList = rawList;
    });

  }

  logOut() {
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }

  updateName() {
    let alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail, data.password);
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }
  updatePackageName() {
    let alert = this.alertCtrl.create({
      title: "Enter New Package Name",
      inputs: [
        {

          name: 'newPackageName',
          placeholder: 'com.example.name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePackageName(data.newPackageName);
          }
        }
      ]
    });
    alert.present();
  }

  addNewDeviceToList() {
    let alert = this.alertCtrl.create({
      message: "Enter Generate Code:",
      inputs: [
        {
          placeholder: "Enter Code",
          label: "Code",
          name: "newDevice"
        }
      ],
      buttons: [
        {
          text: "Save",
          handler: data => {
            //data.newDevice
            this.deviceData.addNewDevice(data.newDevice,this.userProfile.email);

          }
        }
      ]
    });
    alert.present();
  }

 
}