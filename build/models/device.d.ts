import { DeviceLog } from './device-log';
export declare class Device {
    private static loggers;
    private static checks;
    private static POLL_INTERVAL;
    private static deviceInitialized;
    private static timer;
    static getLoggers(): DeviceLog[];
    static initialize(): void;
    private static createDeviceLog;
    static startPolling(): void;
    private static poll;
}
