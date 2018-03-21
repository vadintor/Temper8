import HID = require('node-hid');
import { USBSensor } from './usb-sensor';
export declare class DeviceConfig {
    vendorId: number;
    productId: number;
    product: string;
    interface: number;
}
export declare function isTemperGold(device: HID.Device): boolean;
export declare function isTemper8(device: HID.Device): boolean;
export declare class USBSensorManager {
    static factory(): USBSensor[];
}
