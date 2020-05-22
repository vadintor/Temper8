import HID = require('node-hid');
import { SensorState } from './sensor-state';
import { Temper8 } from './temper-8';
import { TemperGold } from './temper-gold';
import { USBDevice, USBReporter } from './usb-device';

import { SensorLog } from './sensor-log';

import { log } from '../logger';

const VID = 0x0C45;
const PID = 0x7401;
const TEMPER_GOLD = 'TEMPerV1.4';
const TEMPER_8 = 'TEMPer8_V1.5';
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
export class USBController {
    private static devices: USBDevice[] = [];
    private static loggers: SensorLog[] = [];

    public static getLoggers(): SensorLog[] {
        return USBController.loggers;
    }
    private static createSensorLog(sensorState: SensorState) {
        const sensorLog = new SensorLog(sensorState);
        USBController.loggers.push(sensorLog);
        sensorLog.startLogging();
    }
    private static createUSBDevice(path: string, reporter: USBReporter) {
        const hid = new HID.HID(path);
        const usbDevice = new USBDevice (hid, reporter);
        USBController.devices.push(usbDevice);
    }

    public static initialize(): void {
        log.info ('USBController.initialize: start time=' + new Date().toISOString());
        HID.devices().find(device => {
            const deviceStr = JSON.stringify(device);
            if (isTemperGold(device) && device.path !== undefined) {
                log.info('USBController.initialize: TEMPer Gold found: ' +  deviceStr);

                const sensorState = new TemperGold(device);
                USBController.createUSBDevice(device.path, sensorState);
                USBController.createSensorLog(sensorState);

                // return true;
            } else if (isTemper8(device) && device.path !== undefined) {
                log.info('USBController.initialize sensor TEMPer 8 found: ' +  deviceStr);

                const sensorState = new Temper8(device);
                USBController.createUSBDevice(device.path, sensorState);
                USBController.createSensorLog(sensorState);

               // return true;
            } else {
                log.debug('USBController.initialize: unsupported USB device found=' + deviceStr);
            }

            return false;
        });
        log.info('USBController.initialize: Found ' + USBController.devices.length + ' HID device(s)');

    }

    public static setPollingInterval(ms: number) {
        log.debug('USBController.setPollingInterval: ms=' + ms);
        for (const device of USBController.devices) {
            device.setPollingInterval(ms);
        }
    }

    public static getPollingInterval(): number {
        for (const device of USBController.devices) {
           return device.getPollingInterval();
        }
        return 0;
    }
}
