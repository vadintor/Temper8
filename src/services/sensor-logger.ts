import axios, { AxiosInstance } from 'axios';
import { SensorAttributes } from '../models/sensor-attributes';
import { SensorData } from '../models/sensor-data';
import { SensorState } from '../models/sensor-state';

import { log } from './../logger';

export class SensorLogger {
    private attr: SensorAttributes;
    private timestamp: number = 0;
    private state: SensorState;

    private logging: boolean = false;
    private MAX_TIME_DIFF = 60_000;
    private axios: AxiosInstance;

    constructor(attr: SensorAttributes, state: SensorState) {
        log.debug('--- SensorStateLogger:', JSON.stringify(state));
        this.timestamp = Date.now();
        this.logging = false;
        this.attr = attr;
        this.state = state;

        const dataFilter = {
            resolution: this.attr.resolution,
            maxTimeDiff: this.MAX_TIME_DIFF};

        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), dataFilter);

        this.axios = axios.create({
            baseURL: 'https://test.itemper.io/api/v1/sensors',
            headers: {'Content-Type': 'application/json'},
          });
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
                    ' value: ' + JSON.stringify(sensorLog), ' ms: ', diff);
            })
            .catch(function(e) {
                log.error('catch error', e);
            });
        }
    }
}
