import axios, { AxiosError, AxiosInstance } from 'axios';
import { DeviceData } from './device-data';
import { DeviceState } from './device-state';

import { log } from '../logger';

import {Setting, Settings} from './settings';

export interface DeviceDataLog {
    data: DeviceData;
}

export class DeviceLog {
    public retryCounter = 0;
    private state: DeviceState;

    private timestamp: number = 0;
    private logging: boolean = false;

    private axios: AxiosInstance;
    private SHARED_ACCESS_KEY: string = '';
    private ITEMPER_URL: string = '';

    private createAxiosInstance(): AxiosInstance {
        return this.axios = axios.create({
            baseURL: this.ITEMPER_URL + '/device',
            headers: {'Content-Type': 'application/json'}});
    }

    constructor(state: DeviceState) {
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;
        this.initSettings();
        this.state.addDeviceDataListener(this.onDataReceived.bind(this));
        this.axios = this.createAxiosInstance();
    }

    private initSettings() {
        this.SHARED_ACCESS_KEY = Settings.get(Settings.SHARED_ACCESS_KEY).value.toString();

        this.ITEMPER_URL = Settings.get(Settings.ITEMPER_URL).value.toString();
        // this.AZURE_CONNECTION_STRING = Settings.get(Settings.AZURE_CONNECTION_STRING).value.toString();

        Settings.onChange('SHARED_ACCESS_KEY', (setting: Setting) => {
            this.SHARED_ACCESS_KEY = setting.value.toString();
            log.debug('DeviceLog.settingChanged: SHARED_ACCESS_KEY=' + this.SHARED_ACCESS_KEY);
        });

        Settings.onChange('ITEMPER_URL', (setting: Setting)=> {
            this.ITEMPER_URL = setting.value.toString();
            log.debug('DeviceLog.settingChanged: ITEMPER_URL=' +  this.ITEMPER_URL);
            this.axios = this.createAxiosInstance();
        });
    }
    public getState(): DeviceState {
        return this.state;
    }
    public islogging(): boolean {
        return this.logging;
    }
    public startLogging(): void {
        log.debug('DeviceLog.startLogging');
        this.logging = true;
    }

    public stopLogging(): void {
        log.debug('DeviceLog.stopLogging');
        this.logging = false;
    }

    private onDataReceived(data: DeviceData): void {
        if (this.logging) {

            const diff = data.timestamp - this.timestamp;
            this.timestamp = data.timestamp;
            const deviceLog: DeviceDataLog = {data};
            const url = '/status';
            log.debug('DeviceLog.onDataReceived, URL: ' + url);

            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post<DeviceDataLog>(url, deviceLog, {headers: { Authorization }})
            .then (function(res) {
                log.info('DeviceLog.onDataReceived, post ' + url + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(deviceLog) + ' ms: ' + diff +
                    ' date: ' + new Date(data.timestamp.toLocaleString()));
            })
            .catch(function(error: AxiosError) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    log.debug('DeviceLog.onDataReceived:' +  error.response.status + ' - ' +
                    JSON.stringify(error.response.data));
                } else if (error.request) {
                    // The request was made but no response was received
                    log.error('DeviceLog.onDataReceived, request, no response:' + error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    log.error('DeviceLog.onDataReceived,  error.config:' + error.config);
                }

            });
        }
    }
}
