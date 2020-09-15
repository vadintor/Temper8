import ruuvi from 'node-ruuvitag';
import { log } from '../../core/logger';
import { SensorAttributes } from '../sensors/sensor-attributes';
import { SensorLog } from '../sensors/sensor-log';
import { Category, sensorLogService } from '../sensors/sensor-log-service';
import { RuuviSensorState } from './ruuvi-sensor-state';

interface RuuviData5 {
    dataFormat: number; // check === 5
    rssi: number;
    temperature: number;
    humidity: number;
    pressure: number;
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
    battery: number;
    txPower: number;
    movementCounter: number;
    measurementSequenceNumber: number;
    mac: string; // "F6:93:9B:47:10:75"
}
interface RuuviData2or4 {
    url: string;
    dataFormat: number;
    rssi: number;
    humidity: number;
    temperature: number;
    pressure: number;
    eddystoneId: string;
}
type RuuviData = RuuviData2or4 | RuuviData5;

type Sensor  = { state: RuuviSensorState, log: SensorLog };

export interface PeripheralData {
    id: string;
    address: string;
    addressType: string;
    connectable: boolean;
}
interface Peripheral extends PeripheralData {
    on(type: 'updated', listener: (data: RuuviData) => void): void;
    on(type: 'error', listener: (raw: unknown) => void): void;
}
export interface TagStatus {
    dataFormat: number;
    rssi: number;
    battery: number;
    txPower: number;
    mac: string;
}
export interface Tag {
    sensors: Sensor[];
    data: PeripheralData;
    status: TagStatus;
}
export interface Tags {
    [index: string]: Tag;
}

export function init() {
    log.info('ruuvi.initRuuvi');
    ruuvi.on('found', (tag: Peripheral) => {
        log.info('Found RuuviTag=: ' + JSON.stringify(tag));
        createPeripheral(tag);
    });
    ruuvi.on('warning', (message: any) => {
        log.error('ruuvi.ruuvi.on(warning): ' + JSON.stringify(message));
    });
    ruuvi.on('error', (message: any) => {
        log.error('ruuvi.ruuvi.on(error): ' + JSON.stringify(message));
    });
}
export function getRuuviTags(): string[] {
    const ids: string[] = [];
    Object.keys(tags).map(key => ids.push(key));
    return ids;
}
export function startLogging(tagID: string, category: Category) {
    const found = tags[tagID].sensors.find((sensor) => sensor.state.getAttr().category === category);
    if (found) {
        found.log.startLogging();
    }
}
export function StopLogging(tagID: string, category: Category) {
    const found = tags[tagID].sensors.find((sensor) => sensor.state.getAttr().category === category);
    if (found) {
        found.log.stopLogging();
    }
}
let nextAvailablePort = 4;
function newSensor(category: Category) {
    const attr: SensorAttributes = new SensorAttributes(
        'SN',
        'Ruuvitag',
        category,
        2,
        2,
        1);
    const port = nextAvailablePort;
    nextAvailablePort++;
    const state = new RuuviSensorState(attr, port);
    const log = new SensorLog(state, sensorLogService);
    return { state, log };
}
const tags: Tags = {};
function createPeripheral(tag: Peripheral) {
    const status: TagStatus = {dataFormat: 0, rssi: 0, battery: 0, txPower: 0, mac: tag.address};
    tags[tag.id] = {
        sensors: [ newSensor(Category.Temperature) ],
        data: tag as PeripheralData,
        status,
    };
    tag.on('updated', (raw: RuuviData)  => {
        if (isRuuviData5Valid(raw)) {
            const data = raw as RuuviData5;
            tags[tag.id].status = {
                dataFormat: data.dataFormat,
                rssi: data.rssi,
                battery: data.battery,
                txPower: data.txPower,
                mac: data.mac,
            };
            tags[tag.id].sensors.forEach((sensor) => {
                switch (sensor.state.getAttr().category) {
                    case Category.AbsoluteHumidity:
                        sensor.state.update(data.humidity);
                        break;
                    case Category.AirPressure:
                        sensor.state.update(data.pressure);
                        break;
                    case Category.AccelerationX:
                        sensor.state.update(data.accelerationX);
                        break;
                    case Category.AccelerationY:
                        sensor.state.update(data.accelerationY);
                        break;
                    case Category.AccelerationZ:
                        sensor.state.update(data.accelerationZ);
                        break;
                    case Category.Humidity:
                        sensor.state.update(data.humidity);
                        break;
                    case Category.RelativeHumidity:
                        sensor.state.update(data.humidity);
                        break;
                    case Category.Temperature:
                        sensor.state.update(data.temperature);
                        break;
                }
            });
        }
    });
    tag.on('error', (data: any)  => {
        log.error('ruuvi-tag.createPeripheral.on(error): ' + JSON.stringify(data));
    });
    tags[tag.id].sensors.forEach(sensor => sensor.log.startLogging());
}
function isObject(raw: unknown) {
    return typeof raw === 'object' && raw !== null;
}
function isRuuviData5Valid(raw: unknown) {
    let valid = isObject(raw);
    if (valid) {
        const data = raw as Partial<RuuviData5>;
        valid = valid
        && !!data.dataFormat && data.dataFormat === 5;
    }
    return valid;
}
