import axios, { AxiosError, AxiosInstance } from 'axios';
import { SensorData, } from './sensor-data';
import { FilterConfig, SensorState } from './sensor-state';

import { log } from '../../core/logger';

import { stringify } from '../../core/helpers';
import { Setting, Settings } from '../../core/settings';


import WebSocket from 'isomorphic-ws';
export interface Sample {
    date: number;
    value: number;
}

export interface SensorDescriptor {
    SN: string;
    port: number;
}
export interface SensorLogData {
    desc: SensorDescriptor;
    samples: Sample[];
}

export class SensorLog {
    public retryCounter = 0;
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
        const socket = new WebSocket (wsTestUrl, { origin, perMessageDeflate: false });

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

    constructor(state: SensorState) {
        log.debug('SensorLog: SensorStateLogger, state:', JSON.stringify(state));
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;
        this.initSettings();

        this.state.addSensorDataListener(this.onDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));

        this.axios = this.createAxiosInstance();
        this.socket = this.openWebSocket();

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
            this.socket = this.openWebSocket();
        });
        Settings.onChange('WS_ORIGIN', (setting: Setting)=> {
            this.WS_ORIGIN = setting.value.toString();
            log.debug('SensorLog.settingChanged: WS_ORIGIN=' + this.WS_ORIGIN);
            // if (this.socket.OPEN) {
            //     this.socket.close();
            // }
            this.socket = this.openWebSocket();
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

    private onDataReceived(data: SensorData): void {
        const self = this;
        if (this.logging) {
            const desc = { SN: this.state.getAttr().SN, port: data.getPort()};
            const samples = [{date: data.timestamp(), value: data.getValue()}];
            const sensorLog: SensorLogData = { desc, samples };
            const diff = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();

            const url = '/' + desc.SN + '/'+ desc.port;
            log.debug('SensorLog.onDataReceived, URL: ' + url);

            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post<SensorLogData>(url, sensorLog, {headers: { Authorization }})
            .then (function(res) {
                log.info('SensorLog.onSensorDataReceived: axios.post ' + url + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog) + ' ms: ' + diff +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })
            .catch(function(error: AxiosError) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    log.debug('SensorLog.onSensorDataReceived:' +  error.response.status + ' - ' +
                    JSON.stringify(error.response.data));
                    if (error.response.status === 401) {
                        // Wrong shared access key
                        log.debug('SensorLog.onDataReceived: ACCESS DENIED wrong shared access key: ');
                    } else
                    if (error.response.status === 308 ||
                        error.response.status === 404 ||
                        error.response.status === 422) {
                        const {  name } = error.response.data;
                        if (name) {
                            Settings.update(Settings.SERIAL_NUMBER, name, ( updated ) => {
                                if (!updated) {
                                    log.error('SensorLog.onSensorDataReceived: cannot update serial number after redirect request from itemper ');
                                }
                            });
                        }
                        self.registerSensor(data);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    log.error('SensorLog.onSensorDataReceived, request, no response');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    log.error('SensorLog.onSensorDataReceived,  error.config:' + stringify(error.config));
                }

            });
            // AZURE IOT
            // const message = new Message(JSON.stringify(sensorLog));
            // message.properties.add('Delta time', diff.toString());
            // this.client.sendEvent(message, this.printResultFor('send'));
        }
    }

    private registerSensor(data: SensorData): void {
        const stateAttr = this.state.getAttr();
        const attr = {  model: stateAttr.model,
                        category: stateAttr.category.toString(),
                        accuracy: stateAttr.accuracy,
                        resolution: stateAttr.resolution,
                        maxSampleRate: stateAttr.maxSampleRate};
        const desc: SensorDescriptor = { SN: stateAttr.SN, port: data.getPort()};
        const body = { desc, attr };
        const url = '';

        const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;

        this.axios.post(url, body, {headers: { Authorization }})
        .then (function() {
            log.info('SensorLog.registerSensor: axios.post - successful');
        })
        .catch(function(error: AxiosError) {
            try {
                log.debug('SensorLog.registerSensor: catch sensor data:' +  error.response);
                log.info('SensorLog.registerSensor: trying registering the sensor');

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    log.debug('SensorLog.registerSensor:' +  error.response.status + ' - ' +
                    JSON.stringify(error.response.data));
                    if (error.response.status === 401) {
                        // Wrong shared access key
                        log.debug('SensorLog.registerSensor: ACCESS DENIED wrong shared access key: ');
                    } else
                    if (error.response.status === 503) {
                        log.debug('SensorLog.registerSensor: itemper backend '+ this.ITEMPER_URL +' + not available: ' +
                            JSON.stringify(desc));
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    log.error('SensorLog.registerSensor, request, no response:' + error.request.toString());
                } else {
                    // Something happened in setting up the request that triggered an Error
                    log.error('SensorLog.registerSensor,  error.config:' + error.config);
                }

            } catch (e) {
                log.error('SensorLog.registerSensor: catch register: ' + e);
            }
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
            this.socket = this.openWebSocket();
        } else {
            log.debug('SensorLog.onMonitor: socket not open yet');
        }
    }
}
