export enum SensorCategory {
    Temperature = 'Temperature',
    AbsoluteHumidity = 'AbsoluteHumidity',
    RelativeHumidity = 'RelativeHumidity',
    WindSpeed = 'WindSpeed',
}

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
