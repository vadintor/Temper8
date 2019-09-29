import * as WebSocket from 'ws';
import { Setting } from './settings';
export interface InboundMessage {
    command: 'getSensors' | 'getSettings' | 'startMonitor' | 'stopMonitor' | 'saveSetting';
    data: any;
}
export interface OutboundMessage {
    command: 'sensors' | 'settings' | 'setting' | 'log';
    data: any;
}
export declare function initOutboundMessageService(server: WebSocket.Server): void;
export declare function parseInboundMessage(ws: WebSocket, data: Buffer): void;
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
export declare function getSensors(ws: WebSocket): void;
export declare function getSettings(ws: WebSocket): void;
export declare function saveSetting(ws: WebSocket, setting: Setting): void;
export declare function startMonitor(ws: WebSocket, desc: SensorDescription[]): void;
export declare function stopMonitor(ws: WebSocket, desc: SensorDescription[]): void;
