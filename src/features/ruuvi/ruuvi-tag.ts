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
type Sensor  = {state: RuuviSensorState, log: SensorLog };
interface Tag {
    [index: string]: Sensor[];
}
interface PeripheralData {
    id: string;
    address: string;
    addressType: string;
    connectable: boolean;
}
interface Peripheral extends PeripheralData {
    on(type: 'updated', listener: (data: RuuviData) => void): void;
    on(type: 'error', listener: (raw: unknown) => void): void;
}
export function init() {
    log.info('ruuvi.initRuuvi');
    ruuvi.on('found', (tag: Peripheral) => {
        log.debug('Found RuuviTag=: ' + JSON.stringify(tag));
        createPeripheral(tag);
    });
    ruuvi.on('warning', (message: any) => {
        log.error('ruuvi.ruuvi.on(warning): ' + JSON.stringify(message));
    });
    ruuvi.on('error', (message: any) => {
        log.error('ruuvi.ruuvi.on(error): ' + JSON.stringify(message));
    });
}

export function addSensor(tagID: string, category: Category) {
    const found = tags[tagID].find((sensor) => sensor.state.getAttr().category === category);
    if (!found && tags[tagID].length < 8) {
        tags[tagID].push(newSensor(category));
    }
}
export function removeSensor(tagID: string, category: Category) {
    const found = tags[tagID].find((sensor) => sensor.state.getAttr().category === category);
    if (found) {
        const index = tags[tagID].indexOf(found);
        tags[tagID].splice(index, 1);
    }
}
export function getRuuviTags(): string[] {
    const ids: string[] = [];
    Object.keys(tags).map(key => ids.push(key));
    return ids;
}
export function getSensors(tagID: string): Category[] {
    const sensors: Category[] = [];
    tags[tagID].forEach(sensor => sensors.push(sensor.state.getAttr().category));
    return sensors;
}
export function startLogging(tagID: string, category: Category) {
    const found = tags[tagID].find((sensor) => sensor.state.getAttr().category === category);
    if (found) {
        found.log.startLogging();
    }
}
export function StopLogging(tagID: string, category: Category) {
    const found = tags[tagID].find((sensor) => sensor.state.getAttr().category === category);
    if (found) {
        found.log.stopLogging();
    }
}
let nextAvailablePort = 0;
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
    return {state, log};
}
const tags: Tag = {};

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

function createPeripheral(tag: Peripheral) {
    tags[tag.id] = [
        newSensor(Category.Temperature),
    ];
    tag.on('updated', (raw: RuuviData)  => {
        if (isRuuviData5Valid(raw)) {
            const data = raw as RuuviData5;
            tags[tag.id].forEach((sensor) => {
                switch (sensor.state.getAttr().category) {
                    case Category.AbsoluteHumidity:
                        sensor.state.update(data.humidity);
                        break;
                    case Category.AbsoluteHumidity:
                        sensor.state.update(data.humidity);
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
                    case Category.Battery:
                        sensor.state.update(data.battery);
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
                    case Category.TxPower:
                        sensor.state.update(data.txPower);
                        break;
                    case Category.rssi:
                        sensor.state.update(data.rssi);
                        break;
                }
            });
        }
    });
    tag.on('error', (data: any)  => {
        log.error('ruuvi-tag.createPeripheral.on(error): ' + JSON.stringify(data));
    });
    tags[tag.id].forEach(sensor => sensor.log.startLogging());
}
