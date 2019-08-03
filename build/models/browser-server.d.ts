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
