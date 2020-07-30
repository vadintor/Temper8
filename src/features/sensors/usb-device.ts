
import * as HID from 'node-hid';
import * as os from 'os';
import { log } from '../../core/logger';
import { Setting, Settings  } from '../../core/settings';


export interface USBConfig extends HID.Device {

}

// ReportParser allow USBController to be independent on the specific
// Temper device connected.
export interface USBReporter {
    initWriteReport(): number[][];
    readReport(data: number[]): number[];
    maxSampleRate(): number;
}
// Handle a sensor device on the USB hub.
export class USBDevice {
    private  hid: HID.HID;

    private reporter: USBReporter;


    private POLL_INTERVAL: number = 5_000;

    // private POLL_INTERVAL: number = Settings.get('POLL_INTERVAL').value | 5000;
    private MAX_SAMPLE_RATE = 1/this.POLL_INTERVAL;
    private deviceInitialized = false;

    private timer: NodeJS.Timer;

    constructor(hid: HID.HID, reporter: USBReporter) {
        this.hid = hid;
        this.reporter = reporter;
        this.MAX_SAMPLE_RATE = reporter.maxSampleRate();
        if (this.sampleRate() > this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = 1_000 * 1/this.MAX_SAMPLE_RATE;
        }
        Settings.onChange(Settings.POLL_INTERVAL, this.pollIntervalChanged.bind(this));
        this.initialize();
        this.pollSensors();
    }

    private pollIntervalChanged(setting: Setting) {
        const pollInterval =<number>setting.value;
        const sampleRate = 1/(pollInterval/1_000);

        if (sampleRate < this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = pollInterval;
            log.info('USBDevice.pollIntervalChanged to' + pollInterval);
        }
    }
    public initialize() {
        if (!this.deviceInitialized) {
            this.hid.on('data', this.parseInput.bind(this));
            this.hid.on('error', this.parseError.bind(this));
            this.setPollingInterval(this.POLL_INTERVAL);
            this.deviceInitialized = true;
        }
    }

    public close() {
        this.deviceInitialized = false;
        try {
            this.hid.pause();
            this.hid.close();
        } catch (e) {
            return;
        }
    }

    private sampleRate(): number {
        return 1/(this.POLL_INTERVAL/1_000);
    }

    public setPollingInterval(ms: number) {
        this.POLL_INTERVAL = ms;
        if (this.sampleRate() > this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = 1_000 * 1/this.MAX_SAMPLE_RATE;
        }
        clearInterval(this.timer);
        this.timer = setInterval(this.pollSensors.bind(this), this.POLL_INTERVAL);
    }

    public getPollingInterval(): number {
        return this.POLL_INTERVAL;
    }

    // This is were all starts when set interval time expires
    private pollSensors() {
        if (! this.deviceInitialized) {
            this.initialize();
        } else {
            const initCommands = this.reporter.initWriteReport();
            for (const command of initCommands) {
                this.writeReport(command);
            }
        }
    }
    // Called from HID, Parses input from HID and writes any response messages
    // back to the device
    private parseInput(data: number[]): void  {
        try {
            const response = this.reporter.readReport(data);
            if (response.length > 0) {
                this.writeReport(response);
            }
        } catch (e) {
            // TODO error handling if parse input error
            return;
        }
    }
    private parseError(_error: any) {
        log.error('parseError: ', _error);
    }

    // Helper functions to write reports to the device
    private writeReport(data: number[]): void {

        if (os.platform() === 'win32') {
            data.unshift(0);  // prepend a throwaway byte
        }

        // Output report
        for (let i = 0; i < 1; i++) {
            try {
                this.hid.write(data);
            } catch (e) {
                log.error('*** USBController.writeReport hid.write catch:&d', data);
                this.close();
            }

        }
    }
}
