import HID = require('node-hid');
import { SensorCategory } from './sensor-attributes';

import { Temper8 } from './temper-8';
import { TemperGold } from './temper-gold';
import { USBController } from './usb-controller';

import { SensorLog } from './sensor-log';

import { log } from './../logger';

export class DeviceConfig {
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
export class USBSensorManager {
    private static devices: USBController[] = [];
    private static loggers: SensorLog[] = [];

    public static getLoggers(): SensorLog[] {
        return USBSensorManager.loggers;
    }

    public static factory(): void {
        HID.devices().find(device => {
            log.info('device: ', JSON.stringify(device));
            if (isTemperGold(device) && device.path !== undefined) {
                log.info('Sensor TEMPer Gold found');
                const hid = new HID.HID(device.path);
                const temperGold = new TemperGold();
                const attr = {
                        SN: 'TGold',
                        model: 'Temper Gold',
                        category: SensorCategory.Temperature,
                        accuracy: 2.0,
                        resolution: 1,
                        maxSampleRate: 1,
                    };
                const logger = new SensorLog(attr, temperGold);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                const temperGoldDevice = new USBController (hid, temperGold);
                USBSensorManager.devices.push(temperGoldDevice);
                // return true;
            } else if (isTemper8(device) && device.path !== undefined) {
                log.info('Sensor TEMPer 8 found');
                const hid = new HID.HID(device.path);
                const temper8 = new Temper8();
                const attr = {
                    SN: 'Temper8',
                    model: 'Temper 8',
                    category: SensorCategory.Temperature,
                    accuracy: 0.5,
                    resolution: 1,
                    maxSampleRate: 0.2,
                };
                const logger = new SensorLog(attr, temper8);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                const temper8Device = new USBController (hid, temper8);
                USBSensorManager.devices.push(temper8Device);
               // return true;
            }

            return false;
        });
        if (USBSensorManager.devices.length === 0) {
            log.error('Found 0 devices');
        } else {
            log.info('Found %d device(s)', USBSensorManager.devices.length);
        }

    }

}
