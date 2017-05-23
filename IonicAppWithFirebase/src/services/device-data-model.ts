export class DeviceDataModel {
    deviceplatform: string;
    deviceserial: string;
    deviceUUID: string;
    devicemodel: string;
    devicemanufacturer: string;
    status: boolean;
    deviceStolen:boolean;
    email: string;


    constructor(){}

    getDevicePlatform() {
        return this.deviceplatform;
    }

    setDevicePlatform(platform) {
        this.deviceplatform = platform;
    }

    getDeviceSerial() {
        return this.deviceserial;
    }
    setDeviceSerial(serial) {
        this.deviceserial = serial
    }

    getDeviceUUID() {
        return this.deviceUUID;
    }

    setDeviceUUID(uuid) {
        this.deviceUUID = uuid;
    }


    getDeviceModel() {
        return this.devicemodel;
    }

    setDeviceModel(model) {
        this.devicemodel = model;
    }

    getDeviceManufacturer() {
        return this.devicemanufacturer;
    }

    setDeviceManufacturer(manufacturer) {
        this.devicemanufacturer = manufacturer;
    }

    isStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    isDeviceStolen() {
        return this.deviceStolen;
    }

    setDeviceStolen(status) {
        this.deviceStolen = status;
    }
}