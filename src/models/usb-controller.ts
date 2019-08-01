import HID = require('node-hid');
import { SensorState } from './sensor-state';
import { Temper8 } from './temper-8';
import { TemperGold } from './temper-gold';
import { USBDevice, USBReporter } from './usb-device';

import { SensorLog } from './sensor-log';

import { log } from '../logger';

export class USBDeviceConfig {
        vendorId: number;
        productId: number;
        product: string;
        interface: number;
    }

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
    private static initializeLogger(sensorState: SensorState) {
        const sensorlogger = new SensorLog(sensorState);
        USBController.loggers.push(sensorlogger);
        sensorlogger.startLogging();
    }
    private static initializeDevice(path: string, reporter: USBReporter) {
        const hid = new HID.HID(path);
        const device = new USBDevice (hid, reporter);
        USBController.devices.push(device);
    }

    public static initializeDevices(): void {
        log.info ('Application started: ' + new Date().toISOString());
        HID.devices().find(device => {
            log.debug('USBController find device: ' + device);
            if (isTemperGold(device) && device.path !== undefined) {
                log.debug('USBController sensor TEMPer Gold found: ' +  JSON.stringify(device));

                const sensor = new TemperGold();
                USBController.initializeLogger(sensor);
                USBController.initializeDevice(device.path, sensor);
                // return true;
            } else if (isTemper8(device) && device.path !== undefined) {
                log.debug('USBController sensor TEMPer 8 found: ' +  JSON.stringify(device));

                const sensor = new Temper8();

                USBController.initializeLogger(sensor);
                USBController.initializeDevice(device.path, sensor);
               // return true;
            }

            return false;
        });
        log.info('Found ' + USBController.devices.length + ' HID device(s)');

    }

    public static setPollingInterval(ms: number) {
        log.debug('USBController.setPollingInterval: ' + ms);
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
