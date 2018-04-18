import HID = require('node-hid');
import { SensorLog } from './sensor-log';
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
    static getLoggers(): SensorLog[];
    static factory(): void;
    static setPollingInterval(ms: number): void;
}
