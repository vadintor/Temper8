import HID = require('node-hid');
import { SensorLog } from './sensor-log';
export declare class USBDeviceConfig {
    vendorId: number;
    productId: number;
    product: string;
    interface: number;
}
export declare function isTemperGold(device: HID.Device): boolean;
export declare function isTemper8(device: HID.Device): boolean;
export declare class USBController {
    private static devices;
    private static loggers;
    static getLoggers(): SensorLog[];
    private static initializeLogger;
    private static initializeDevice;
    static initializeDevices(): void;
    static setPollingInterval(ms: number): void;
    static getPollingInterval(): number;
}
