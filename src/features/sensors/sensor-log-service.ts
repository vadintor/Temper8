import axios, { AxiosError, AxiosInstance } from 'axios';

import { log } from '../../core/logger';

import { stringify } from '../../core/helpers';
import { Setting, Settings } from '../../core/settings';

import WebSocket from 'isomorphic-ws';

export enum Category {
    Temperature = 'Temperature',
    AbsoluteHumidity = 'AbsoluteHumidity',
    RelativeHumidity = 'RelativeHumidity',
    WindSpeed = 'WindSpeed',
    rssi = 'rssi',
    Humidity = 'Humidity',
    AirPressure = 'AirPressure',
    AccelerationX = 'AccelerationX',
    AccelerationY = 'AccelerationY',
    AccelerationZ = 'AccelerationZ',
    Battery = 'Battery',
    TxPower = 'TxPower',
}
export interface Sample {
    value: number;
    date: number;
}
export interface Descriptor {
    SN: string;
    port: number;
}
export interface Attributes {
    model: string;
    category: Category;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;
}
export interface Log {
    desc: Descriptor;
    samples: Sample[];
}
export interface Registration {
    desc: Descriptor;
    attr: Attributes;
}
export interface SensorLogError {
    status: number;
    desc: Descriptor;
}
export interface ISensorLogService {
    registerSensor(registration: Registration): Promise<Descriptor>;
    PostSensorLog(data: Log): Promise<Descriptor>;
    writeSensorLog(sensorLog: Log): void;
}
export class SensorLogService implements  ISensorLogService {
    private axios: AxiosInstance;
    private SHARED_ACCESS_KEY: string = '';
    private WS_URL: string = '';
    private WS_ORIGIN: string = '';
    private ITEMPER_URL: string = '';
    private socket: WebSocket;

    private createAxiosInstance(): AxiosInstance {
        return this.axios = axios.create({
            baseURL: this.ITEMPER_URL + '/sensors',
            headers: {'Content-Type': 'application/json'}});
    }

    private openWebSocket(): WebSocket {
        // const wsTestUrl = 'wss://test.itemper.io/ws';
        const wsTestUrl = this.WS_URL;
        const origin = this.WS_ORIGIN;
        const protocol = 'device';
        const socket = new WebSocket (wsTestUrl, { protocol, origin, perMessageDeflate: false });

        socket.on('open', () => {
            log.info('SensorLog.openWebSocket.on(open): Device.SensorLog connected to backend!');
        });
        socket.on('message', (data: WebSocket.Data): void => {
            log.info('SensorLog.openWebSocket.on(message): ' + data);
        });
        socket.on('error', (self: WebSocket, error: Error) => {
            log.error('SensorLog.openWebSocket.on(error): ws=' + JSON.stringify(self));
            log.error('SensorLog.openWebSocket.on(error): error=' + JSON.stringify(error));
        });

        socket.on('close', (self: WebSocket, code: number, reason: string) => {

            if (code === 404) {
                log.info('SensorLog.openWebSocket.on(close): code: 404');
            }
            log.info('SensorLog.openWebSocket.on(close): ws=' + JSON.stringify(self));
            log.info('SensorLog.openWebSocket.on(close): code/reason=' + code +'/'+ reason);
        });
        return socket;
    }
    constructor() {
        this.initSettings();
        this.axios = this.createAxiosInstance();
        this.socket = this.openWebSocket();
    }

    private initSettings() {
        this.SHARED_ACCESS_KEY = Settings.get(Settings.SHARED_ACCESS_KEY).value.toString();
        this.WS_URL = Settings.get(Settings.WS_URL).value.toString();
        this.WS_ORIGIN = Settings.get(Settings.WS_ORIGIN).value.toString();
        this.ITEMPER_URL = Settings.get(Settings.ITEMPER_URL).value.toString();
        // this.AZURE_CONNECTION_STRING = Settings.get(Settings.AZURE_CONNECTION_STRING).value.toString();

        Settings.onChange('SHARED_ACCESS_KEY', (setting: Setting) => {
            this.SHARED_ACCESS_KEY = setting.value.toString();
            log.info('SensorLog.settingChanged: SHARED_ACCESS_KEY=' + this.SHARED_ACCESS_KEY);
        });
        Settings.onChange('WS_URL', (setting: Setting)=> {
            this.WS_URL = setting.value.toString();
            log.info('SensorLog.settingChanged: WS_URL=' + this.WS_URL);
            this.socket = this.openWebSocket();
        });
        Settings.onChange('WS_ORIGIN', (setting: Setting)=> {
            this.WS_ORIGIN = setting.value.toString();
            log.info('SensorLog.settingChanged: WS_ORIGIN=' + this.WS_ORIGIN);
            // if (this.socket.OPEN) {
            //     this.socket.close();
            // }
            this.socket = this.openWebSocket();
        });
        Settings.onChange('ITEMPER_URL', (setting: Setting)=> {
            this.ITEMPER_URL = setting.value.toString();
            log.info('SensorLog.settingChanged: ITEMPER_URL=' +  this.ITEMPER_URL);
            this.axios = this.createAxiosInstance();
        });
        Settings.onChange('AZURE_CONNECTION_STRING', (setting: Setting)=> {
            log.info('settingChanged: AZURE_CONNECTION_STRING not implemented value=' + setting.value.toString());
        });
    }
    public registerSensor(registration: Registration): Promise<Descriptor> {
        return new Promise((resolve, reject) => {
            const body = registration;
            const url = '';
            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post(url, body, {headers: { Authorization }})
            .then (function() {
                log.info('sensor-log-service.registerSensor: registration successful: '
                    + JSON.stringify(registration.desc));
                resolve(registration.desc);
            })
            .catch(function(error: AxiosError) {
                try {
                    const err = { status: handleError(error), desc: registration.desc };
                    reject(err);
                } catch {
                    const err = { status: handleError(error), desc: registration.desc };
                    reject(err);
                }
            });
        });
    }
    public PostSensorLog(data: Log): Promise<Descriptor> {
        return new Promise((resolve, reject) => {
            const url = '/' + data.desc.SN + '/'+ data.desc.port;
            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post<Log>(url, data, {headers: { Authorization }})
            .then (function(res) {
                log.info('sensor-log-service.PostSensorLog: ' + url + ' ' + res.statusText);
                resolve(data.desc);
            })
            .catch(function(error: AxiosError) {
                try {
                    const err = { status: handleError(error), desc: data.desc };
                    reject(err);
                } catch {
                    const err = { status: handleError(error), desc: data.desc };
                    reject(err);
                }
            });
        });
    }
    public writeSensorLog(data: Log): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {command: 'log', data};
            log.info('sensor-log-service.writeSensorLog: ' + JSON.stringify(message));
            this.socket.send(JSON.stringify(message));
        } else if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            log.info('sensor-log-service.writeSensorLog: socket closed, re-open');
            this.socket = this.openWebSocket();
        } else {
            log.debug('sensor-log-service.writeSensorLog: : socket not open yet');
        }
    }
}
export let sensorLogService: SensorLogService;

export function init() {
    sensorLogService = new SensorLogService();
}

function handleError(error: AxiosError): number {
    let status = 1;
    if (error.response) {
        log.error('SensorLog.handleError: Error=' + error.response.statusText);
        status = error.response.status;
        if (error.response.status === 308) {
            const {  name } = error.response.data;
            if (name) {
                Settings.update(Settings.SERIAL_NUMBER, name, ( updated ) => {
                    if (!updated) {
                        log.error('sensor-log-service.PostSensorLog: cannot update serial number after redirect request from itemper ');
                    }
                });
            }
        }
    } else if (error.request) {
        // The request was made but no response was received
        log.error('SensorLog.handleError, no response' + JSON.stringify(error.request));
    } else {
        // Something happened in setting up the request that triggered an Error
        log.error('SensorLog.handleError,  error.config:' + stringify(error.config));
    }
    return status;
}

