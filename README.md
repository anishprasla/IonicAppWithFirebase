# IonicAppWithFirebase
Ionic web/native app using Firebase database

Prerequisite:
1.	Install NodeJS as Ionic is an npm package. Download the installer here.
2.	Install Ionic 2: npm install -g ionic@beta.22 
3.	Install Android SDK (GenyMotion Recommended as it’s much faster.  Genymotion is an alternate emulator that is blazing fast, and allows you to emulate native functionality like GPS and camera.)
4.	sudo npm install -g cordova

Steps to Create & Build Ionic Project using Ionic CLI:
1.	ionic start MobileAppLicense blank --v2  (It will create blank app with name MobileAppLicense)
2.	cd MobileAppLicense (cd to the app folder)
3.	ionic serve (To play in the browser)
4.	ionic platform add ios/android (For MobileAppLicense added android)
5.	ionic emulate/run ios/android (To run android in emulator. Make sure emulator is running)
6.	ionic platform add browser (this will create www folder which can be deployed on node server)
7.	ionic build android (generates .apk file in platforms\android\build\outputs\apk)

To add project file:
1.	Extract the folder
2.	Copy all the files in app folder and paste in app folder of the app you created above and try to run & build.
