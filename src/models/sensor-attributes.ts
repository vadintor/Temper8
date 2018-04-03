export enum SensorCategory {
    Temperature,
    AbsoluteHumidity,
    RelativeHumidity,
    WindSpeed,
}

export interface SensorAttributes {
    SN: string;
    model: string;
    category: SensorCategory;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;
}
