import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DeviceData } from '../../providers/device-data';
import { HomePage } from '../home/home';
import { ItemSliding } from 'ionic-angular';

/*
  Generated class for the DeviceManager page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-device-manager',
  templateUrl: 'device-manager.html'
})
export class DeviceManagerPage {
  private deviceList: any;
  private loadedDeviceList: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public deviceData: DeviceData) {
    this.navCtrl = navCtrl;
    this.deviceData = deviceData;

    this.displayDevice();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceManagerPage');
  }

  displayDevice() {
    this.deviceData.getDeviceList().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        let showStatus: string;
        let deviceStolenStatus: string;
        if (snap.val().status) {
          showStatus = "Active";
        }
        else showStatus = "Deactive";
        if (snap.val().deviceStolen)
          deviceStolenStatus = "Yes";
        else
          deviceStolenStatus = "No";
        rawList.push({
          id: snap.key,
          uuid: snap.val().deviceUUID,
          model: snap.val().devicemodel,
          serial: snap.val().deviceserial,
          manufacturer: snap.val().devicemanufacturer,
          status: showStatus,
          flag:snap.val().deviceStolen,
          deviceStolen: deviceStolenStatus,
          email: snap.val().email
        });
      });
      this.deviceList = rawList;
      this.loadedDeviceList = rawList;
    });
  }
  private status: Boolean;
  goToDeviceDetail(deviceid, status) {
    if (status == "Active") {
      this.status = true;
    }
    else {
      this.status = false;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Update License status');
    if (this.status == true) {
      alert.addInput({
        type: 'radio',
        label: 'Activate',
        value: 'true',

        checked: true
      });

      alert.addInput({
        type: 'radio',
        label: 'Deactivate',
        value: 'false',

      });
    }
    else {
      alert.addInput({
        type: 'radio',
        label: 'Activate',
        value: 'true',

      });

      alert.addInput({
        type: 'radio',
        label: 'Deactivate',
        value: 'false',

        checked: true

      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Update',
      handler: data1 => {
        this.deviceData.updateDeviceStatus(deviceid, data1);
        //this.displayDevice();
        //alert.dismiss().catch(() => {});
      }
    });
    alert.present();

  }

  reportStolen(deviceid, status) {
    let stolenStatus: boolean;
    if (status == "Yes") {
      stolenStatus = true;
    }
    else {
      stolenStatus = false;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('Device lost?');
    if (stolenStatus == true) {
      alert.addInput({
        type: 'radio',
        label: 'Yes',
        value: 'true',

        checked: true
      });

      alert.addInput({
        type: 'radio',
        label: 'No',
        value: 'false',

      });
    }
    else {
      alert.addInput({
        type: 'radio',
        label: 'Yes',
        value: 'true',

      });

      alert.addInput({
        type: 'radio',
        label: 'No',
        value: 'false',

        checked: true

      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Update',
      handler: data1 => {
        this.deviceData.updateDeviceStolenStatus(deviceid, data1);
        this.displayDevice();
        //alert.dismiss().catch(() => {});
      }
    });
    alert.present();

  }
  
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.deviceList = this.deviceList.filter((v) => {
      if (v.email && q) {
        if (v.email.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.deviceList.length);

  }

  initializeItems(): void {
    this.deviceList = this.loadedDeviceList;
  }
}
