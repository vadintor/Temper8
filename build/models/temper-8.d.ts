import { SensorState } from './sensor-state';
import { ReportParser } from './usb-controller';
export declare class Temper8 extends SensorState implements ReportParser {
    protected nextSensor: number;
    initReport(): number[][];
    parseInput(data: number[]): number[];
    private usedPortsRequest();
    private matchUsedPorts(data);
    private temperatureRequest(port);
    private matchTemperature(data);
    private GetTemperature(msb, lsb);
    private check03Request();
    private matchCheck03(data);
    private check05Request();
    private matchCheck05(data);
    private check0DRequest();
    private matchCheck0D(data);
    private matchCheckFF(data);
}
