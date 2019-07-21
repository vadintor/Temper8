export declare enum SensorCategory {
    Temperature = 0,
    AbsoluteHumidity = 1,
    RelativeHumidity = 2,
    WindSpeed = 3
}
export interface SensorAttributes {
    SN: string;
    model: string;
    category: SensorCategory;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;
}
