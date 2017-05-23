import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { DeviceData } from '../../providers/device-data';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  private subscribe: boolean = false;
  public deviceList: any;
  public loadedDeviceList: any;

  private lineChartLabel = [];
  private lineChartData = [];

  private doughnutLabel = [];
  private doughnutData = [];

  private barLabel = [];
  private barData = [];

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public deviceData: DeviceData) {

    this.deviceData = deviceData;
    this.displayDevice();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.loadCharts();

  }

  loadCharts() {

    this.initializeItems();
    this.getChartData();
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: this.barLabel,
        datasets: [{
          label: '# of Brands',
          data: this.barData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        }
      }

    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.doughnutLabel,
        datasets: [{
          label: '# of Devices',
          data: this.doughnutData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',

          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",

          ]
        }]
      }

    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: this.lineChartLabel,
        datasets: [
          {
            label: "License Purchased",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.lineChartData,
            spanGaps: false,

          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {

              stepSize: 1
            }
          }]
        }
      }
    });
    this.subscribe = false;


  }
  getChartData() {

    let brandList = [];

    let activeCount: number = 0;
    let deactiveCount: number = 0;
    let stoleCount: number = 0;

    let dateArray = ["Jan 2017", "Feb 2017", "Mar 2017"];
    let jan: number = 0;
    let feb: number = 0;
    let mar: number = 0;
    let apr: number = 0;


    if (this.loadedDeviceList) {
      this.loadedDeviceList.filter((snap) => {
        //doughnut
        if (snap.status && !snap.deviceStolen) {
          activeCount = activeCount + 1;
        }
        else if(!snap.status  && !snap.deviceStolen){
          deactiveCount = stoleCount + 1;
        }
        if (snap.deviceStolen)
          stoleCount = stoleCount + 1;

        //lineChart
        let split = [];
        split = snap.createDate.split("-");

        if (split[1] == "Jan")
          jan = jan + 1;
        else if (split[1] == "Feb")
          feb = feb + 1;
        else if (split[1] == "Mar")
          mar = mar + 1;
        else if (split[1] == "Apr")
          apr = apr + 1;

        // Brand
        brandList.push(snap.devicemanufacturer);
      });
    }

    ///doughnut Data start
    this.doughnutLabel.push("No. of Downloads");
    this.doughnutData.push(activeCount + deactiveCount + stoleCount);
    this.doughnutLabel.push("Active License");
    this.doughnutData.push(activeCount);
    this.doughnutLabel.push("License Deactivated");
    this.doughnutData.push(deactiveCount);
    this.doughnutLabel.push("Reported Stolen");
    this.doughnutData.push(stoleCount);
    //doughnut ends

    // start
    this.lineChartLabel = dateArray;
    this.lineChartData.push(jan);
    this.lineChartData.push(feb);
    this.lineChartData.push(mar);
    //this.lineChartData.push(apr);
    //ends

    //start

    let result: any = this.getArrayCount(brandList);
    this.barLabel = result[0];
    this.barData = result[1];

    //ends

  }

  getArrayCount(arr) {
    let a = []; let b = []; let prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }

    return [a, b];
  }
  displayDevice() {
    this.deviceData.getDeviceList().on('value', snapshot => {

      let rawList = [];
      snapshot.forEach(snap => {

        rawList.push({
          id: snap.key,
          deviceUUID: snap.val().deviceUUID,
          devicemodel: snap.val().devicemodel,
          deviceserial: snap.val().deviceserial,
          devicemanufacturer: snap.val().devicemanufacturer,
          status: snap.val().status,
          deviceStolen: snap.val().deviceStolen,
          createDate: snap.val().createDate,
          expiryDate: snap.val().expiryDate,
          email: snap.val().email
        });
      });
      if (rawList) {
        this.deviceList = rawList;
        this.loadedDeviceList = rawList;
      }
      

    });
  }
  initializeItems(): void {
    this.deviceList = this.loadedDeviceList;
  }
}
