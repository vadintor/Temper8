import axios, { AxiosInstance } from 'axios';
import { SensorAttributes } from '../models/sensor-attributes';
import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';

import { log } from './../logger';

import * as Primus from 'primus';

const Socket: any = Primus.createSocket ( {transformer: 'uws'});
export interface LoggingService {

}
export class SensorLog {
    private attr: SensorAttributes;
    private state: SensorState;

    private timestamp: number = 0;
    private logging: boolean = false;
    private MAX_TIME_DIFF = 5*60_000;
    private dataFilter: FilterConfig= {
        resolution: this.attr.resolution,
        maxTimeDiff: this.MAX_TIME_DIFF};

        private axios: AxiosInstance;
    private socket: any;
    private open: boolean = false;

    constructor(attr: SensorAttributes, state: SensorState) {
        log.debug('--- SensorStateLogger:', state);
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
        const wsTestUrl = 'ws://itemper.vading.lan:3000/primus';
        // const wsDevUrl = 'ws://localhost:3000/primus';

        this.socket = new Socket (wsTestUrl);
        const self = this;
        this.socket.on('open', function() {
            self.open = true;
            log.info('--- socket.on: Device.SensorLog connected to backend!');
        });
        this.socket.on('data', function(data: any) {
            log.info('--- socket.on: Data received from back-end' + data);
        });
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
