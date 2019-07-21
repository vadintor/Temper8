import axios, { AxiosInstance } from 'axios';
import { SensorAttributes } from '../models/sensor-attributes';
import { SensorData } from '../models/sensor-data';
import { SensorState } from '../models/sensor-state';

import { log } from './../logger';

import * as Primus from 'primus';

// Import Azure

import { Client, Message } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';

const Socket: any = Primus.createSocket ( {transformer: 'uws'});

export class SensorLog {
    private attr: SensorAttributes;
    private timestamp: number = 0;
    private state: SensorState;

    private logging: boolean = false;
    private MAX_TIME_DIFF = 5*60_000;
    private axios: AxiosInstance;
    private socket: any;
    private open: boolean = false;

    // Azure IOT
    // tslint:disable-next-line:max-line-length
    private connectionString: string = '';


    private client: Client;


    constructor(attr: SensorAttributes, state: SensorState) {
        log.debug('--- SensorStateLogger:', state);
        this.timestamp = Date.now();
        this.logging = false;
        this.attr = attr;
        this.state = state;

        const dataFilter = {
            resolution: this.attr.resolution,
            maxTimeDiff: this.MAX_TIME_DIFF};

        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this), undefined);

        this.axios = axios.create({
            baseURL: 'https://test.itemper.io/api/v1/sensors',
            headers: {'Content-Type': 'application/json'},
          });

          // Web sockets
        const wsTestUrl = 'ws://itemper.vading.lan:3000/primus';
        const wsDevUrl = 'ws://localhost:3000/primus';

        this.socket = new Socket (wsTestUrl);
        const self = this;
        this.socket.on('open', function() {
            self.open = true;
            log.info('Device.SensorLog connected to backend!');
        });
        this.socket.on('data', function(data: any) {
            log.info('Data received from back-end: ' + data);
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
    public startLogging(): void {
        log.debug('--- SensorStateLogger.startLogging');
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
            .catch(function(e) {
                log.error('catch error', e);
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
        this.socket.write(sensorLog);
    }
}
