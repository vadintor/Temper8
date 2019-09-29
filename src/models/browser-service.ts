import * as WebSocket from 'ws';
import { log } from '../logger';
import { SensorAttributes } from './sensor-attributes';
import { SensorData } from './sensor-data';
import { SensorState } from './sensor-state';
import { Setting, Settings } from './settings';
import { USBController } from './usb-controller';

export interface InboundMessage {
    command: 'getSensors'|'getSettings'| 'startMonitor' | 'stopMonitor' | 'saveSetting';
    data: any;
}

export interface OutboundMessage {
    command: 'sensors' | 'settings'| 'setting' |  'log';
    data: any;
}
let wss: WebSocket.Server;

function broadcast(ws: WebSocket, message: OutboundMessage, includeSelf: boolean ) {
    log.debug('browser-Service.broadcast: sending message=' + JSON.stringify(message));
    wss.clients.forEach(function each(client) {
        if ((client !== ws || includeSelf) && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
          log.debug('browser-Service.broadcast: message sent');
        }
      });

}
export function initOutboundMessageService(server: WebSocket.Server) {
    wss=server;
}
export function parseInboundMessage(ws: WebSocket, data: Buffer): void  {
    const message = <InboundMessage> JSON.parse(data.toString());
    log.debug('browser-service.parseInboundMessage: received message=' + message);
    switch (message.command) {
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
        case 'saveSetting':
            message.data = <Setting> <any> message.data;
            saveSetting(ws, message.data);
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
    desc: SensorDescription;
    samples: SensorSample[];
}


function description(attr: SensorAttributes, data: SensorData): SensorDescription {
    return {SN: attr.SN, port: data.getPort()};
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
        sensorLogs.push({ desc: description(attr, sensor), samples});
    }
}
export function getSensors(ws: WebSocket) {
    const loggers = USBController.getLoggers();
    const command = 'sensors';
    const data: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        AddSensorLogs(data, state);
    }
    const message = JSON.stringify({command, data});
    ws.send(message);
    log.info('browser-services.getSensors, sent: ' + message);
}

export function getSettings(ws: WebSocket) {
    const data: Setting[] = Settings.all();
    const message = JSON.stringify({command:'settings', data});
    ws.send(message);
    log.info('browser-service.getSettings: ' + message);
}

export function saveSetting(ws: WebSocket, setting: Setting) {
    log.debug('browser-service.saveSetting: ' + JSON.stringify(setting));
    if (setting.name && setting.value) {
        Settings.update(setting.name, setting.value, (updated) => {
            if (updated) {
                const command = 'settings';
                const data = [];
                data.push(setting);
                const message: OutboundMessage = {command, data};
                broadcast(ws, message, true);
            }
        });
    }

}
const MonitoringClients = new Set();
let logTimer: NodeJS.Timer;

export function startMonitor(ws: WebSocket, desc: SensorDescription[]) {
    log.info('browser-service.startMonitor: has not implemented filter on Desc yet: ' + JSON.stringify(desc));
    if (!MonitoringClients.has(ws)) {
        MonitoringClients.add(ws);
    }

    if (MonitoringClients.size === 1) {
        logTimer = setInterval(logSensorData, USBController.getPollingInterval());
    }
    log.info ('Browser-service.startMonitor: ' + MonitoringClients.size + ' clients');
}

export function stopMonitor(ws: WebSocket, desc: SensorDescription[]) {
    log.info('browser-service.stopMonitor: has not implemented filter on Descr yet: ' + JSON.stringify(desc));

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
    const command = 'log';
    const data: SensorLog[] = [];
    for (const logger of loggers) {
        const state = logger.getState();
        AddSensorLogs(data, state);
    }
    const message = JSON.stringify({command, data});

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


