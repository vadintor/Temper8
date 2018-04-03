import HID = require('node-hid');
import { SensorLogger } from './../services/sensor-logger';
export declare class DeviceConfig {
    vendorId: number;
    productId: number;
    product: string;
    interface: number;
}
export declare function isTemperGold(device: HID.Device): boolean;
export declare function isTemper8(device: HID.Device): boolean;
export declare class USBSensorManager {
    private static devices;
    private static loggers;
    static getLoggers(): SensorLogger[];
    static factory(): void;
}
