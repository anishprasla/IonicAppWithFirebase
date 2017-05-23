import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { DeviceDataModel } from '../services/device-data-model';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Device } from 'ionic-native';
import firebase from 'firebase';
import {enableProdMode} from '@angular/core';
import { DeviceData } from '../providers/device-data';
import { Splashscreen } from 'ionic-native';

enableProdMode();

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [DeviceDataModel],
})
export class MyApp {
  rootPage: any;
  zone: NgZone;

  constructor(platform: Platform, private deviceDataModel:DeviceDataModel, private deviceData:DeviceData) {
    this.zone = new NgZone({});
    firebase.initializeApp({
    apiKey: "AIzaSyCY70LdkOPkiRxFB6VkPN4DDTseudvZTiQ",
    authDomain: "mobilelicense-d6e72.firebaseapp.com",
    databaseURL: "https://mobilelicense-d6e72.firebaseio.com",
    storageBucket: "mobilelicense-d6e72.appspot.com",
    messagingSenderId: "651777949540"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run( () => {
        if (!user) {
          this.rootPage = LoginPage;
          unsubscribe();
        } else { 
          this.rootPage = HomePage;
          deviceData.getAppPackageName();
          unsubscribe();
        }
      });
      
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }


}