import { Injectable } from '@angular/core';
import { DeviceDataModel } from '../services/device-data-model';
import { Platform, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Device } from 'ionic-native';
import { File } from 'ionic-native';
import { AuthData } from '../providers/auth-data';


declare var cordova: any;

@Injectable()
export class UserLicense {
    public userProfile: any;
    public currentUser: any;
    public deviceList: any;
    files: any;
    public blob = '';
    public filecontents;
    public fileLocation; public filestatus;
    data = new DeviceDataModel();
    data1 = new DeviceDataModel();
    mobileOs: boolean = false;
    constructor(private platform: Platform, private deviceDataModel: DeviceDataModel, public authData: AuthData, public alertCtrl: AlertController) {
        this.platform = platform;
                this.userProfile = firebase.database().ref('appPackages/com-ionic-appwrap/users');
        this.deviceList = firebase.database().ref("appPackages/com-ionic-appwrap/devices");
        this.platform.ready().then(() => {

            //os and version
            let system = this.platform.is('ios') ? 'ios' : (this.platform.is('android') ? 'android' : 'windows');
            if (system.toLowerCase() == 'android') {
                this.mobileOs = true;
                this.getDeviceDataBlob();
            }
            else this.mobileOs = false;
            //console.log(system + '@ ' + Device.version);

        });
    }

    getUserProfile(): any {
        return this.userProfile.child(this.currentUser.uid);
    }

    userDeviceLicense(email: string) {

        this.data.email = email;

        //Already got device information in constructor

        if (this.mobileOs) {
            //Store in DB

            this.data.status = true;
            this.data.deviceStolen = false;
            this.saveUserLicenseDB();

            //Create License .lic File on device storge
            this.createLicenseFile();
        }

    }

    saveUserLicenseDB() {
        this.currentUser = firebase.auth().currentUser

        console.log("DB")
        this.deviceList.child(Device.uuid).update({
            deviceplatform: Device.platform,
            deviceserial: Device.serial,
            deviceUUID: Device.uuid,
            devicemodel: Device.model,
            devicemanufacturer: Device.manufacturer,
            status: this.data.status,
            deviceStolen: this.data.deviceStolen,
            email: this.data.email
        });
    }



    createLicenseFile() {

        const fs: string = cordova.file.dataDirectory;
        this.fileLocation = fs;
        File.checkDir(fs, 'MobileLicense').then(() => {
            //If Directory Exists
            console.log('Directory Exist');
            this.readFile();
        }).catch(err => {
            console.log(err);
            this.createDirectory();
        });
    }

    createDirectory() {
        console.log("Creating Directory");
        File.createDir(cordova.file.dataDirectory, 'MobileLicense', true).then(s => {
            //Create license file
            console.log('Directory Created');
            this.createFile();

        }).catch(err => {
            console.log("Fail to create directory");
        });

    }

    createFile() {
        console.log("Creating License File");

        File.writeFile(cordova.file.dataDirectory + 'MobileLicense/', 'license.lic', this.getDeviceDataBlob(), true).then(s => {
            console.log("License file created");
            //this.filestatus = "License File created";
            this.getDirectory();
        }).catch(err => {
            this.filestatus = "Error Occurred while creating license file" + err;
        });
    }


    getDirectory() {
        File.listDir(cordova.file.dataDirectory, 'MobileLicense').then((list) => {
            console.log(JSON.stringify(list));
            this.files = list;
        }).catch(err => {
            console.log(err);
        });
    }

    readFile() {

        File.readAsText(cordova.file.dataDirectory + 'MobileLicense/', 'license.lic').then(s => {
            this.data1 = JSON.parse(s.toString());
            this.filecontents = this.data1.deviceUUID;


            //this.filedetails = new DeviceDataModel().setDeviceUUID(dr);
        }).catch(err => console.log(err + "Error reading file"));

    }

    getDeviceStatus(email: string): any {
        /***
         * After Login Credential verified:
         * 1. Check .lic file Exists
         * 2. Check Device uid matches as per in File along with status - Offline Mode
         * 3. Check device uid in DB and check the status 
         * 
         */
        const fs: string = cordova.file.dataDirectory;
        this.fileLocation = fs;
        console.log(fs);
        let flag: boolean = true;
        File.checkDir(fs, 'MobileLicense').then(() => {
            File.checkFile(fs + 'MobileLicense/', 'license.lic').then(() => {
                File.readAsText(fs + 'MobileLicense/', 'license.lic').then(s => {
                    this.data1 = JSON.parse(s.toString());
                    if (this.data1.deviceUUID == Device.uuid) {
                        if (!this.data1.deviceStolen) {
                            if (this.data1.status) {
                                if (this.data1.email == this.data.email) {
                                    flag = true;
                                }
                                else {
                                    flag = false;
                                    this.alertWindow("User not authorised on this device");
                                }
                            }
                            else {
                                flag = false;
                                this.alertWindow("License deactivated. Please contact admin.");
                            }
                        }
                        else {
                            flag = false;
                            this.alertWindow("Device reported as stolen.");
                        }
                        return flag;
                    }
                    else {
                        
                        if (this.checkDBDevice()) {
                            this.createLicenseFile();
                            
                            return true;
                        } else {
                            this.alertWindow("License not found");
                            return flag;
                        }

                            
                    }

                }).catch(err => { console.log(err + "Error reading file") });


            }).catch(err => {
                if (this.checkDBDevice()) {
                    this.createLicenseFile();
                    return true;
                }
            });

        }).catch(err => {
            console.log("No Directory");

            if(this.checkDBDevice())
                return true;
                else {
                    this.alertWindow("License not found");
                    return false;
                }
            
        });
    }

    checkDBDevice(): any {
        this.currentUser = firebase.auth().currentUser;
        
        let flag: boolean = false;
        this.getDeviceDetail(Device.uuid).on('value', snapshot => {
            snapshot.forEach(snap => {
                this.data1 = JSON.parse(snap.toString());
                this.data.status = snap.status;
                this.data.deviceStolen = snap.deviceStolen;

                if (snap) {
                    if (!this.data1.deviceStolen) {
                        if (this.data1.status) {
                            this.createLicenseFile();
                            flag = true;
                        }
                        else {
                            
                            this.createLicenseFile()
                            flag = false;
                            this.alertWindow("License deactivated. Please contact admin.");
                        }
                    }
                    else {
                        flag = false;
                        this.alertWindow("Device reported as stolen.");
                    }
                    return flag;
                }
                else {
                        flag = false;
                        this.alertWindow("License not found");
                    return flag;
                }
            });
        });
    }

    getDeviceDataBlob() {
        if (this.mobileOs) {
            this.data.deviceplatform = Device.platform;
            this.data.deviceserial = Device.serial;
            this.data.deviceUUID = Device.uuid;
            this.data.devicemodel = Device.model;
            this.data.devicemanufacturer = Device.manufacturer;

            this.blob = JSON.stringify(this.data);
            console.log(this.blob);
            return this.blob;
        }
    }


    getDeviceList(): any {
        return this.deviceList;
    }

    getDeviceDetail(devicelistId): any {
        return this.deviceList.child(devicelistId);
    }

    alertWindow(msg) {
        let confirm = this.alertCtrl.create({
            title: 'License Status',
            message: msg,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.authData.logoutUser();

                    }
                }
            ]
        });
        confirm.present();
        this.authData.logoutUser();

    }
}