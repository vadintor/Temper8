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
            startMonitor(ws, message.data);
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

function sensorLog(state: SensorState): SensorLog {

    const attr: SensorAttributes = state.getAttr();
    const sensorData = state.getSensorData();
    const samples: SensorSample[] = [];
    for (const data of sensorData) {
        samples.push(sensorSample(data));
    }
    return { descr: description(attr, sensorData[0]), samples};

}
export function getSensors(ws: WebSocket) {
    const loggers = USBController.getLoggers();
    const sensorLogs: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        sensorLogs.push(sensorLog(state));
    }
    const message = {descr:'sensors', data: sensorLogs};
    ws.send(JSON.stringify(message));
}

export function getSettings(ws: WebSocket) {
    const message = {descr:'settings', data: [{setting: 'hostname', value: HOSTNAME}]};
    ws.send(JSON.stringify(message));
}
const MonitoringClients = new Set();
let logTimer: NodeJS.Timer;
export function startMonitor(ws: WebSocket, descr: SensorDescription[]) {
    log.info('browser-service. startMonitor: has not implemented filter on Descr yet: ' + descr);
    if (!MonitoringClients.has(ws)) {
        MonitoringClients.add(ws);
    }

    if (MonitoringClients.size === 1) {
        logTimer = setInterval(logSensorData, USBController.getPollingInterval());
    }
}

export function stopMonitor(ws: WebSocket, descr: SensorDescription[]) {
    log.info('browser-service. stopMonitor: has not implemented filter on Descr yet: ' + descr);

    if (MonitoringClients.has(ws)) {
        MonitoringClients.delete(ws);
    }
    if (MonitoringClients.size === 0) {
        clearTimeout(logTimer);
    }
}
function logSensorData() {
    const loggers = USBController.getLoggers();
    const sensorLogs: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        sensorLogs.push(sensorLog(state));
    }
    const message = {descr:'log', data: sensorLogs};

    MonitoringClients.forEach((ws: WebSocket) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        }

        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING ) {
            MonitoringClients.delete(ws);
        }
    });
}


