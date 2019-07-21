export enum SensorCategory {
    Temperature,
    AbsoluteHumidity,
    RelativeHumidity,
    WindSpeed,
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
