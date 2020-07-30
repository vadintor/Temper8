import { Category } from './sensor-log-service';

export import SensorCategory = Category;

// export enum SensorCategory {
//     Temperature = 'Temperature',
//     AbsoluteHumidity = 'AbsoluteHumidity',
//     RelativeHumidity = 'RelativeHumidity',
//     WindSpeed = 'WindSpeed',
//     rssi = 'rssi',
//     Humidity = 'Humidity',
//     AirPressure = 'AirPressure',
//     AccelerationX = 'AccelerationX',
//     AccelerationY = 'AccelerationY',
//     AccelerationZ = 'AccelerationZ',
//     Battery = 'Battery',
//     TxPower = 'TxPower',
// }

export class SensorAttributes {
    SN: string;
    model: string;
    category: SensorCategory;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;

    constructor(SN: string,
                model: string,
                category: SensorCategory,
                accuracy: number,
                resolution: number,
                maxSampleRate: number) {
        this.SN = SN;
        this.model = model;
        this.category = category;
        this.accuracy = accuracy;
        this.resolution = resolution;
        this.maxSampleRate = maxSampleRate;
    }
}
