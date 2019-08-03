import axios, { AxiosInstance } from 'axios';
import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';
import { ITEMPER_URL, WS_ORIGIN, WS_URL } from './../config';
// import { AZURE_CONNECTION_STRING, ITEMPER_URL, WS_ORIGIN, WS_URL } from './../config';
import { log } from './../logger';

import WebSocket from 'isomorphic-ws';

// Import Azure

// import { Client, Message } from 'azure-iot-device';
// import { Mqtt } from 'azure-iot-device-mqtt';



export interface SensorLogData {
    descr: { SN: string, port: number};
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

    private socket: WebSocket;

    // Azure IOT
    // tslint:disable-next-line:max-line-length
    // private connectionString: string = '';
    // private client: Client;

    private openSocket(): WebSocket {
        // const wsTestUrl = 'wss://test.itemper.io/ws';
        const wsTestUrl = WS_URL + '';
        const socket = new WebSocket (wsTestUrl, { origin: WS_ORIGIN});

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
            log.error('SensorLog: socket.on(error): ');
        });

        return socket;
    }

    constructor(state: SensorState) {
        log.debug('SensorLog: SensorStateLogger, state:', JSON.stringify(state));
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;

        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));

        this.axios = axios.create({
            baseURL: ITEMPER_URL,
            headers: {'Content-Type': 'application/json'},
          });

        this.socket = this.openSocket();

        // AZURE IOT
        // this.connectionString = AZURE_CONNECTION_STRING + '';
        // this.client = Client.fromConnectionString(this.connectionString, Mqtt);
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
        log.debug('--- SensorStateLogger.startLogging');
        if (filter) {
            this.dataFilter = filter;
        }

        this.logging = true;
    }

    public stopLogging(): void {
        log.debug('--- SensorStateLogger.stopLogging');
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
            const descr = { SN: this.state.getAttr().SN, port: data.getPort()};
            const samples = [{date: data.timestamp(), value: data.getValue()}];
            const sensorLog = { descr, samples };
            const diff = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();

            const url = '/' + descr.SN + '/'+ descr.port;
            log.debug('URL: ' + url);
            this.axios.post(url, sensorLog)
            .then (function(res) {
                log.info('SensorLogger axios.post ' + url + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog) + ' ms: ' + diff +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })
            .catch(function() {
                log.info('onSensorDataReceived axios.post catch error');
            });
            // AZURE IOT
            // const message = new Message(JSON.stringify(sensorLog));
            // message.properties.add('Delta time', diff.toString());
            // this.client.sendEvent(message, this.printResultFor('send'));
        }
    }

    private onMonitor(data: SensorData): void {
        log.debug('SensorLog.onMonitor');
        const descr = { SN: this.state.getAttr().SN, port: data.getPort()};
        const samples = [{date: data.timestamp(), value: data.getValue()}];
        const sensorLog = { descr, samples };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            log.debug('onMonitor: sensor log: ' + JSON.stringify(sensorLog));
            this.socket.send(JSON.stringify(sensorLog));
            log.debug('onMonitor: sensor log sent');
        } else if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            log.debug('onMonitor: socket closed, re-open');
            this.socket = this.openSocket();
        } else {
            log.debug('onMonitor: socket not open yet');
        }
    }
}
