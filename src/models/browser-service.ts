import { log } from '../logger';

import WebSocket from 'ws';
import { HOSTNAME } from '../config';
import { SensorAttributes } from './sensor-attributes';
import { SensorData } from './sensor-data';
import { SensorState } from './sensor-state';
import { USBController } from './usb-controller';

export interface Inboundmessage {
    descr: 'getSensors'|'getSettings'| 'updateSettings' |'startMonitor' | 'stopMonitor';
    data: any;
}

export interface OutboundMessage {
    descr: 'sensors'|'settings'| 'log';
    data: any;
}
export function parseInboundMessage(ws: WebSocket, data: Buffer): void  {
    const message = <Inboundmessage> <any> JSON.parse(data.toString());

    switch (message.descr) {
        case 'getSensors':
            getSensors(ws);
            break;
        case 'getSettings':
            getSettings(ws);
            break;
        case 'startMonitor':
            message.data = <SensorDescription[]> <any> message.data;
            startMonitor(ws, message.data);
            break;
        case 'stopMonitor':
            message.data = <SensorDescription[]> <any> message.data;
            stopMonitor(ws, message.data);
            break;
      }

}
export interface SensorDescription {
    SN: string;
    port: number;
}
export interface SensorSample {
    value: number;
    date: number;
}
export interface SensorLog {
    descr: SensorDescription;
    samples: SensorSample[];
}
function description(attr: SensorAttributes, sensorData: SensorData): SensorDescription {
    return {SN: attr.SN, port: sensorData.getPort()};
}

function sensorSample(data: SensorData): SensorSample {
    return {value: data.getValue(), date: data.timestamp()};
}

function AddSensorLogs(sensorLogs: SensorLog[], state: SensorState): void {

    const attr: SensorAttributes = state.getAttr(); // Common attributes for all sensors connected
    const sensorData: SensorData[] = state.getSensorData(); // one sensorData for each sensor

    for (const sensor of sensorData) {
        const samples: SensorSample[] = [];
        samples.push(sensorSample(sensor));
        sensorLogs.push({ descr: description(attr, sensor), samples});
    }
}
export function getSensors(ws: WebSocket) {
    const loggers = USBController.getLoggers();
    const descr = 'sensors';
    const data: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        AddSensorLogs(data, state);
    }
    const message = JSON.stringify({descr, data});
    ws.send(message);
    log.info('browser-services.getSensors, sent: ' + message);
}

export function getSettings(ws: WebSocket) {
    const message = JSON.stringify({descr:'settings', data: [{setting: 'hostname', value: HOSTNAME}]});
    ws.send(message);
    log.info('browser-service.getSettings: has not implemented all settings yet: ' + message);
}
const MonitoringClients = new Set();
let logTimer: NodeJS.Timer;

export function startMonitor(ws: WebSocket, descr: SensorDescription[]) {
    log.info('browser-service.startMonitor: has not implemented filter on Descr yet: ' + JSON.stringify(descr));
    if (!MonitoringClients.has(ws)) {
        MonitoringClients.add(ws);
    }

    if (MonitoringClients.size === 1) {
        logTimer = setInterval(logSensorData, USBController.getPollingInterval());
    }
    log.info ('Browser-service.startMonitor: ' + MonitoringClients.size + ' clients');
}

export function stopMonitor(ws: WebSocket, descr: SensorDescription[]) {
    log.info('browser-service.stopMonitor: has not implemented filter on Descr yet: ' + JSON.stringify(descr));

    if (MonitoringClients.has(ws)) {
        MonitoringClients.delete(ws);
    }
    if (MonitoringClients.size === 0) {
        clearTimeout(logTimer);
    }
    log.info ('Browser-service.stopMonitor: ' + MonitoringClients.size + ' clients');
}
function logSensorData() {
    const loggers = USBController.getLoggers();
    const descr = 'log';
    const data: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        AddSensorLogs(data, state);
    }
    const message = JSON.stringify({descr, data});

    MonitoringClients.forEach((ws: WebSocket) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(message);
        }

        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING ) {
            MonitoringClients.delete(ws);
        }
    });
    log.info ('Browser-service.logSensorData: sent to ' + MonitoringClients.size + ' clients, message: ' + message);
}


