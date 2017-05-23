import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { EmailValidator } from '../../validators/email';
import { UserLicense } from '../../providers/user-license';
import { Device } from 'ionic-native';
import { DeviceData } from '../../providers/device-data';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  mobileOs: any;
  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder, public platform: Platform,
    public alertCtrl: AlertController, public deviceData: DeviceData, public loadingCtrl: LoadingController, public userLicense: UserLicense) {
    this.platform.ready().then(() => {

      //os and version
      let system = this.platform.is('ios') ? 'ios' : (this.platform.is('android') ? 'android' : 'windows');
      if (system.toLowerCase() == 'android') {
        this.mobileOs = true;

      }
      else this.mobileOs = false;
      //console.log(system + '@ ' + Device.version);

    });
    /**
     * Creates a ControlGroup that declares the fields available, their values and the validators that they are going
     * to be using.
     *
     * I set the password's min length to 6 characters because that's Firebase's default, feel free to change that.
     */
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * If the form is valid it will call the AuthData service to log the user in displaying a loading component while
   * the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  loginUser(): void {


    this.submitAttempt = true;

    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
        this.deviceData.getAppPackageName();
        let system = this.platform.is('ios') ? 'ios' : (this.platform.is('android') ? 'android' : 'windows');
        if (system.toLowerCase() == 'android') {
          if (this.userLicense.getDeviceStatus(this.loginForm.value.email)) {

            this.nav.setRoot(HomePage);
          }

        } else {
          this.nav.setRoot(HomePage);
        }


      }, error => {
        // this.loading.dismiss().then( () => {
        //   let alert = this.alertCtrl.create({
        //     message: error.message,
        //     buttons: [
        //       {
        //         text: "Ok",
        //         role: 'cancel'
        //       }
        //     ]
        //   });
        //   alert.present();
        // });
      });

      // this.loading = this.loadingCtrl.create({
      //   dismissOnPageChange: true,
      // });
      // this.loading.present();


    }

  }

  goToSignup(): void {
    this.nav.push(SignupPage);
  }

  goToResetPassword(): void {
    this.nav.push(ResetPasswordPage);
  }

  goToGenerateCode(): any {
    
    let alert = this.alertCtrl.create({
      message: "Code:" + Device.uuid,
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}
