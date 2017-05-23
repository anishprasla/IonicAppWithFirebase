import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
/*
  Generated class for the DeviceData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceData {
  public currentUser: any;
  public deviceList: any;
  public userProfile: any;
  public userPackageName: any;

  constructor() {
  
  }

  getDeviceList(): any {
        
      this.deviceList = firebase.database().ref('appPackages/'+this.userPackageName+'/devices');
      return this.deviceList;

   
  }
getAdminDeviceList(): any {
this.deviceList = firebase.database().ref('appPackages/com-ionic-appwrap/devices/');
      return this.deviceList;
}
  getAdminDeviceListData(deviceId): any {
        
      this.deviceList = firebase.database().ref('appPackages/com-ionic-appwrap/devices/');
      return this.deviceList.child(deviceId);
  }

  getAppPackageName(): any {

    this.currentUser = firebase.auth().currentUser.uid;

    this.userProfile = firebase.database().ref('appPackages/com-ionic-appwrap/users/' + this.currentUser);
    this.userProfile.on('value', (data) => {
      console.log(data.val().appPackage);

      this.userPackageName = data.val().appPackage;
     
    });
  }

  getDeviceDetail(deviceId): any {

    return this.deviceList.child(deviceId);
  }

  addNewDevice(newDeviceId,email): any {
       this.userProfile = firebase.database().ref('appPackages/com-ionic-appwrap/devices/');
        this.userProfile.child(newDeviceId).update({
            status:true,
            deviceUUID:newDeviceId,
            email:email,
            deviceStolen:false
        });

    }

    private status:Boolean;
    updateDeviceStatus(deviceId, data):any {
       if(data == "true") {
      this.status = true;
       }
      else {
      this.status = false;
      }
      this.deviceList = firebase.database().ref('appPackages/'+this.userPackageName+'/devices');
      this.deviceList.child(deviceId).update({
        status:this.status,
      });
     
  }

    private stolenStatus:Boolean;deviceStatus:Boolean;
    updateDeviceStolenStatus(deviceId, data):any {
       if(data == "true") {
      this.stolenStatus = true;
      this.deviceStatus = false;
       }
      else {
      this.stolenStatus = false;
      this.deviceStatus = true;
      }
      console.log(this.userPackageName);
      this.deviceList = firebase.database().ref('appPackages/'+this.userPackageName+'/devices');
      this.deviceList.child(deviceId).update({
        deviceStolen:this.status,
        status: this.deviceStatus
      });
     
  }
}
