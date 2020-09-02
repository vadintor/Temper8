import axios, { AxiosError, AxiosInstance } from 'axios';
import { log } from '../../core/logger';
import { DeviceState } from './device-state';
import { DeviceStatus } from './device-status';


import {Setting, Settings} from '../../core/settings';

export interface DeviceDataLog {
    data: DeviceStatus;
}

export class DeviceLog {
    public retryCounter = 0;
    private state: DeviceState;
    private logging: boolean = false;

    private axios: AxiosInstance;
    private SHARED_ACCESS_KEY: string = '';
    private ITEMPER_URL: string = '';
    private onDataReceivedError = false;

    private createAxiosInstance(): AxiosInstance {
        return this.axios = axios.create({
            baseURL: this.ITEMPER_URL + '/device',
            headers: {'Content-Type': 'application/json'}});
    }

    constructor(state: DeviceState) {
        this.onDataReceivedError = false;
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
            log.info('DeviceLog.settingChanged: SHARED_ACCESS_KEY=' + this.SHARED_ACCESS_KEY);
        });

        Settings.onChange('ITEMPER_URL', (setting: Setting)=> {
            this.ITEMPER_URL = setting.value.toString();
            log.info('DeviceLog.settingChanged: ITEMPER_URL=' +  this.ITEMPER_URL);
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
        log.info('DeviceLog.startLogging');
        this.logging = true;
    }

    public stopLogging(): void {
        log.info('DeviceLog.stopLogging');
        this.logging = false;
    }

    private onDataReceived(data: DeviceStatus): void {
        const m = 'DeviceLog.onDataReceived: ';
        if (this.logging) {
            const deviceLog: DeviceDataLog = {data};
            const url = '/status';
            log.debug(m + 'URL: ' + url);
            const Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post<DeviceDataLog>(url, deviceLog, {headers: { Authorization }})
            .then (function(res) {
                log.debug(m + 'post ' + res.config.url + ' ' + res.statusText);
                this.onDataReceivedError = false;
            })
            .catch(function(error: AxiosError) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (!this.onDataReceivedError) {
                        this.onDataReceivedError = true;
                        log.error(m + 'response status: ' +  error.response.status +
                        ', baseURL: ' + error.config.baseURL);
                    }
                    log.debug(m + 'response data: ' + JSON.stringify(error.response.data));
                } else if (error.request) {
                    // The request was made but no response was received
                    if (!this.onDataReceivedError) {
                        this.onDataReceivedError = true;
                        log.error(m + 'no response:' +  JSON.stringify(error.config.baseURL));
                    }
                    log.debug(m + 'error.request=' + JSON.stringify(error.request));
                } else {
                    // Something happened in setting up the request that triggered an Error
                    if (!this.onDataReceivedError) {
                        this.onDataReceivedError = true;
                        log.error(m + 'error.config:' + JSON.stringify(error.config));
                    }
                }
            });
        }
    }
}
