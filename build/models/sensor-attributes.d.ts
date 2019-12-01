export declare enum SensorCategory {
    Temperature = "Temperature",
    AbsoluteHumidity = "AbsoluteHumidity",
    RelativeHumidity = "RelativeHumidity",
    WindSpeed = "WindSpeed"
}
export declare class SensorAttributes {
    SN: string;
    model: string;
    category: SensorCategory;
    accuracy: number;
    resolution: number;
    maxSampleRate: number;
    constructor(SN: string, model: string, category: SensorCategory, accuracy: number, resolution: number, maxSampleRate: number);
}
