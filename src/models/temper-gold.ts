
import { SensorState } from './sensor-state';
import { ReportParser } from './usb-controller';

import { log } from './../logger';


// Temper Gold parser understands HID reports from Temper8 devices
// Independent of USB lib used.

export class TemperGold extends SensorState implements ReportParser {
    // Interface methods implementation

    constructor() {
        super();
        this.connectSensors(1, 1);
    }
    public initReport(): number[][] {
        return [this.temperatureRequest()];
    }
    // This function parses all input reports and check what to do
    public parseInput(data: number[]): number[] {
        try {
            log.debug('--- TemperGold.parseInput:', data);
            if (!this.matchTemperature(data)) {
                log.warning('*** no match: ', data);
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    }

    // Poll temperature and update sensor data

    // byte string for requesting the temperature from Temper Gold
    private temperatureRequest(): number[] {
        return [0x01, 0x80, 0x33, 0x01, 0x00, 0x00, 0x00, 0x00];
    }

    // This methods update sensor state if data contains the temperature byte string
    private  matchTemperature(data: number[]) {

        // Make sure the input report is a temperature report,
        // These hex values were found by analyzing USB using USBlyzer.
        // I.e. they might be different on your Device device
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x02) {
            log.debug('+++ TemperGold.matchTemperature:', data);
            const port = 0;
            const msb: number = data[2];
            const lsb: number = data[3];
            const temperatureCelsius: number = this.GetTemperature(msb, lsb);

            this.updateSensor(port, temperatureCelsius);
            return true;
        } else {
            return false;
        }
    }
    private  GetTemperature(msb: number, lsb: number): number {
        let temperature: number = 0.0;

        let reading: number = (lsb & 0xFF) + (msb << 8);

        // Assume positive temperature value
        let result: number = 1;

        if ((reading & 0x8000) > 0) {
            // Below zero
            // get the absolute value by converting two's complement
            reading = (reading ^ 0xffff) + 1;

            // Remember a negative result
            result = -1;
        }

        // The east significant bit is 2^-8 so we need to divide by 256 to get absolute temperature in Celsius
        // Then we multiply in the result to get whether the temperature is below zero degrees and convert to
        // floating point
        temperature = result * reading / 256.0;

        return temperature;
    }
}
