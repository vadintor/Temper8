import axios, { AxiosInstance } from 'axios';
import { SensorAttributes } from '../models/sensor-attributes';
import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';

import { log } from './../logger';

import * as Websocket from 'isomorphic-ws';

// Import Azure

import { Client, Message } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';



export interface LoggingService {

}
export class SensorLog {
    private attr: SensorAttributes;
    private state: SensorState;

    private timestamp: number = 0;
    private logging: boolean = false;
    private MAX_TIME_DIFF = 5*60_000;
    private dataFilter: FilterConfig= {
        resolution: 1,
        maxTimeDiff: this.MAX_TIME_DIFF};

        private axios: AxiosInstance;

    private socket: Websocket;
    private open: boolean = false;

    // Azure IOT
    // tslint:disable-next-line:max-line-length
    private connectionString: string = '';
    private client: Client;


    constructor(attr: SensorAttributes, state: SensorState) {
        log.debug('--- SensorStateLogger, state:', state);
        log.debug('--- SensorStateLogger, attr:', attr);
        this.timestamp = Date.now();
        this.logging = false;
        this.attr = attr;
        this.state = state;
        if (this.open) {
            this.open = true;
        }
        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));

        this.axios = axios.create({
            baseURL: 'https://test.itemper.io/api/v1/sensors',
            headers: {'Content-Type': 'application/json'},
          });

        const wsTestUrl = 'wss://test.itemper.io/ws';
        const wsOrigin = 'https://itemper.io';
        this.socket = new Websocket (wsTestUrl, { origin: wsOrigin});
        const self = this;

        this.socket.on('open', (ws: Websocket) => {
            self.open = true;
            this.socket = ws;
            log.info('--- socket.on: Device.SensorLog connected to backend!');
        });
        this.socket.on('message', (data: Websocket.Data): void => {
            log.info('--- socket.on: message received from back-end' + JSON.stringify(data));
        });

        this.socket.on('error', (ws: WebSocket, err: Error): void => {
            log.error('--- socket.on: error: ' + JSON.stringify(err));
        });

        // AZURE IOT
        this.connectionString = 'HostName=iothubiotlabs.azure-devices.net;DeviceId=twilight-sound-798cd80;' +
                                'SharedAccessKey=7jobimPqYZEFvfsjSYZMmRjkk7xIs6cs721AIRYHpMU=';
        this.client = Client.fromConnectionString(this.connectionString, Mqtt);
    }

    public getAttr(): SensorAttributes {
        return this.attr;
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
    private printResultFor(op: string): any {
        return function printResult(err: any, res: any) {
        if (err) {
            log.error(op + ' AZURE IOT error: ' + err.toString());
        }
        if (res) {
            log.info(op + ' AZURE IOT status: ' + res.constructor.name);
        }
    };
  }

    private onSensorDataReceived(data: SensorData): void {
        if (this.logging) {
            const descr = { SN: this.attr.SN, port: data.getPort()};
            const samples = [{date: data.timestamp(), value: data.getValue()}];
            const sensorLog = { descr, samples };
            const diff = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();

            const url = '/' + descr.SN + '/'+ descr.port;
            log.debug('URL: ', url);
            this.axios.post(url, sensorLog)
            .then (function(res) {
                log.info('SensorLogger axios.post ' + url + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog) + ' ms: ' + diff +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })
            .catch(function() {
                log.error('onSensorDataReceived axios.post catch error');
            });
            // AZURE IOT
            const message = new Message(JSON.stringify(sensorLog));
            message.properties.add('Delta time', diff.toString());
            this.client.sendEvent(message, this.printResultFor('send'));
        }
    }

    private onMonitor(data: SensorData): void {
        log.debug('SensorLog.onMonitor');
        const descr = { SN: this.attr.SN, port: data.getPort()};
        const samples = [{date: data.timestamp(), value: data.getValue()}];
        const sensorLog = { descr, samples };
        if (this.socket.OPEN) {
            this.socket.send(sensorLog);
            log.debug('onMonitor: sent sensor log');
        } else {
            log.debug('onMonitor: socket not open');
        }
    }
}
