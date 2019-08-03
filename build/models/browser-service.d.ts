import WebSocket from 'ws';
export interface Inboundmessage {
    descr: 'getSensors' | 'getSettings' | 'updateSettings' | 'startMonitor' | 'stopMonitor';
    data: any;
}
export interface OutboundMessage {
    descr: 'sensors' | 'settings' | 'log';
    data: any;
}
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
    descr: SensorDescription;
    samples: SensorSample[];
}
export declare function getSensors(ws: WebSocket): void;
export declare function getSettings(ws: WebSocket): void;
export declare function startMonitor(ws: WebSocket, descr: SensorDescription[]): void;
export declare function stopMonitor(ws: WebSocket, descr: SensorDescription[]): void;
