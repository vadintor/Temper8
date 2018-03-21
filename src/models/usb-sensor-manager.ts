import HID = require('node-hid');

import { Temper8 } from './temper-8';
import { TemperGold } from './temper-gold';
import { USBController } from './usb-controller';


export class DeviceConfig {
        vendorId: number;
        productId: number;
        product: string;
        interface: number;
    }

const VID = 0x0C45;
const PID = 0x7401;
const TEMPER_GOLD = 'TEMPerV1.4';
const TEMPER_8 = 'TEMPerV1.5';
const INTERFACE = 1;


export function isTemperGold(device: HID.Device): boolean {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_GOLD &&
        device.interface === INTERFACE);
}

export function isTemper8(device: HID.Device): boolean {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_8 &&
        device.interface === INTERFACE);
}
export class USBSensorManager {
    public static factory(): USBController[] {
        const devices: USBController[] = [];

        HID.devices().find(device => {
            if (isTemperGold(device) && device.path !== undefined) {
                const hid = new HID.HID(device.path);
                const temperGold = new USBController (hid, new TemperGold());
                devices.push(temperGold);

            } else if (isTemper8(device) && device.path !== undefined) {
                const hid = new HID.HID(device.path);
                const temper8 = new USBController (hid, new Temper8());
                devices.push(temper8);
            }
            return false;
        });
        return devices;
    }

}
