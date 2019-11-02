import axios, { AxiosInstance } from 'axios';
import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';

import { log } from './../logger';

import {Setting, Settings} from './settings';

import WebSocket from 'isomorphic-ws';

// Import Azure

// import { Client, Message } from 'azure-iot-device';
// import { Mqtt } from 'azure-iot-device-mqtt';



export interface SensorLogData {
    desc: { SN: string, port: number};
    samples: SensorData[];
}

export class SensorLog {
    private state: SensorState;

    private timestamp: number = 0;
    private logging: boolean = false;
    private MAX_TIME_DIFF = 5*60_000;
    private dataFilter: FilterConfig= {
        resolution: 1,
        maxTimeDiff: this.MAX_TIME_DIFF};

    private axios: AxiosInstance;
    private SHARED_ACCESS_KEY: string = '';
    private WS_URL: string = '';
    private WS_ORIGIN: string = '';
    private ITEMPER_URL: string = '';
 // private AZURE_CONNECTION_STRING: string;


    private socket: WebSocket;

    // Azure IOT
    // tslint:disable-next-line:max-line-length
    // private connectionString: string = '';
    // private client: Client;

    private createAxiosInstance(): AxiosInstance {
        return this.axios = axios.create({
            baseURL: this.ITEMPER_URL,
            headers: {'Content-Type': 'application/json'}});
    }

    private openSocket(): WebSocket {
        // const wsTestUrl = 'wss://test.itemper.io/ws';
        const wsTestUrl = this.WS_URL;
        const origin = this.WS_ORIGIN;
        const socket = new WebSocket (wsTestUrl, { origin });

        socket.on('open', () => {
            log.info('SensorLog: socket.on(open): Device.SensorLog connected to backend!');
        });
        socket.on('message', (data: WebSocket.Data): void => {
            log.info('SensorLog: socket.on(message): received from back-end' + JSON.stringify(data));
        });
        socket.on('message', (data: WebSocket.Data): void => {
            log.info('SensorLog: socket.on(message): received from back-end' + JSON.stringify(data));
        });

        socket.on('error', (): void => {
            log.info('SensorLog: socket.on(error): ');
        });

        return socket;
    }

    constructor(state: SensorState) {
        log.debug('SensorLog: SensorStateLogger, state:', JSON.stringify(state));
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;
        this.initSettings();

        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));

        this.axios = this.createAxiosInstance();
        this.socket = this.openSocket();

        // AZURE IOT
        // this.connectionString = AZURE_CONNECTION_STRING + '';
        // this.client = Client.fromConnectionString(this.connectionString, Mqtt);
    }

    private initSettings() {
        this.SHARED_ACCESS_KEY = Settings.get(Settings.SHARED_ACCESS_KEY).value.toString();
        this.WS_URL = Settings.get(Settings.WS_URL).value.toString();
        this.WS_ORIGIN = Settings.get(Settings.WS_ORIGIN).value.toString();
        this.ITEMPER_URL = Settings.get(Settings.ITEMPER_URL).value.toString();
        // this.AZURE_CONNECTION_STRING = Settings.get(Settings.AZURE_CONNECTION_STRING).value.toString();

        Settings.onChange('SHARED_ACCESS_KEY', (setting: Setting) => {
            this.SHARED_ACCESS_KEY = setting.value.toString();
            log.debug('SensorLog.settingChanged: SHARED_ACCESS_KEY=' + this.SHARED_ACCESS_KEY);
        });
        Settings.onChange('WS_URL', (setting: Setting)=> {
            this.WS_URL = setting.value.toString();
            log.debug('SensorLog.settingChanged: WS_URL=' + this.WS_URL);
            this.socket = this.openSocket();
        });
        Settings.onChange('WS_ORIGIN', (setting: Setting)=> {
            this.WS_ORIGIN = setting.value.toString();
            log.debug('SensorLog.settingChanged: WS_ORIGIN=' + this.WS_ORIGIN);
            // if (this.socket.OPEN) {
            //     this.socket.close();
            // }
            this.socket = this.openSocket();
        });
        Settings.onChange('ITEMPER_URL', (setting: Setting)=> {
            this.ITEMPER_URL = setting.value.toString();
            log.debug('SensorLog.settingChanged: ITEMPER_URL=' +  this.ITEMPER_URL);
            this.axios = this.createAxiosInstance();
        });
        Settings.onChange('AZURE_CONNECTION_STRING', (setting: Setting)=> {
            log.info('settingChanged: AZURE_CONNECTION_STRING not implemented value=' + setting.value.toString());
        });
    }

    public getState(): SensorState {
        return this.state;
    }

    public getFilter(): FilterConfig {
        return this.dataFilter;
    }
    public islogging(): boolean {
        return this.logging;
    }
    public startLogging(filter?: FilterConfig): void {
        log.debug('SensorLog.startLogging');
        if (filter) {
            this.dataFilter = filter;
        }

        this.logging = true;
    }

    public stopLogging(): void {
        log.debug('SensorLog.stopLogging');
        this.logging = false;
    }

    // Print AZURE IOT results.
//     private printResultFor(op: string): any {
//         return function printResult(err: any, res: any) {
//         if (err) {
//             log.error(op + ' AZURE IOT error: ' + err.toString());
//         }
//         if (res) {
//             log.info(op + ' AZURE IOT status: ' + res.constructor.name);
//         }
//     };
//   }

    private onSensorDataReceived(data: SensorData): void {
        if (this.logging) {
            const desc = { SN: this.state.getAttr().SN, port: data.getPort()};
            const samples = [{date: data.timestamp(), value: data.getValue()}];
            const sensorLog = { desc, samples };
            const diff = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();

            const url = '/' + desc.SN + '/'+ desc.port;
            log.debug('URL: ' + url);

            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;

            this.axios.post(url, sensorLog, {headers: { Authorization }})
            .then (function(res) {
                log.info('SensorLog.onSensorDataReceived: axios.post ' + url + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog) + ' ms: ' + diff +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })
            .catch(function(e) {
                log.error('SensorLog.onSensorDataReceived: axios.post catch error code='+ e.status);
                if (e.status === 403) {
                    log.debug('SensorLog.onSensorDataReceived: register sensor');
                    this.registerSensor(data);
                }
            });
            // AZURE IOT
            // const message = new Message(JSON.stringify(sensorLog));
            // message.properties.add('Delta time', diff.toString());
            // this.client.sendEvent(message, this.printResultFor('send'));
        }
    }

    private registerSensor(data: SensorData): void {
        const self = this;
        const attr = this.state.getAttr();
        const desc = { SN: attr.SN, port: data.getPort()};
        const body = { desc, attr };
        const url = '';

        const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;

        this.axios.post(url, body, {headers: { Authorization }})
        .then (function(res) {
            log.info('SensorLog.registerSensor: axios.post - register sensor desc=' + JSON.stringify(res));
        })
        .catch(function(e) {
            log.error('SensorLog.registerSensor: axios.post - cannot register desc=' +
                        JSON.stringify(desc) + ', status=' + e.status);
            setTimeout(() => self.registerSensor(data), 5_000);
        });
    }
    private onMonitor(data: SensorData): void {
        log.debug('SensorLog.onMonitor');
        const desc = { SN: this.state.getAttr().SN, port: data.getPort()};
        const samples = [{date: data.timestamp(), value: data.getValue()}];
        const sensorLog = { desc, samples };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            log.debug('SensorLog.onMonitor: sensor log: ' + JSON.stringify(sensorLog));
            this.socket.send(JSON.stringify(sensorLog));
            log.debug('SensorLog.onMonitor: sensor log sent');
        } else if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            log.debug('SensorLog.onMonitor: socket closed, re-open');
            this.socket = this.openSocket();
        } else {
            log.debug('SensorLog.onMonitor: socket not open yet');
        }
    }
}
