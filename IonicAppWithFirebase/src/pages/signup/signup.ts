import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { UserLicense } from '../../providers/user-license';
import { DeviceData } from '../../providers/device-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  appPackageChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  appPackageupdate:string;

  constructor(public nav: NavController, public authData: AuthData, public userLicense: UserLicense, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public deviceData: DeviceData) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      appPackage: ['', Validators.required]
    })
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(): void {
    try{
        this.submitAttempt = true;

        if (!this.signupForm.valid){
          console.log(this.signupForm.value);
        } else {
          this.appPackageupdate = this.signupForm.value.appPackage;
          this.appPackageupdate = this.appPackageupdate.replace(".","-");
          this.appPackageupdate = this.appPackageupdate.replace(".","-");

          this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password,this.appPackageupdate.toLowerCase()).then(() => {
            this.nav.setRoot(HomePage);
            //call User device method which store & create license for user
            this.deviceData.userPackageName = this.appPackageupdate;
            this.userLicense.userDeviceLicense(this.signupForm.value.email);
          }, (error) => {
          });
          //   this.loading.dismiss();
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

          // this.loading = this.loadingCtrl.create({
          //   dismissOnPageChange: true,
          // });
          // this.loading.present();
        }
    }
  
  catch (e){
    console.log(e);
  }
}
}