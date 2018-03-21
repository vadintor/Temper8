export declare enum Category {
    IndoorTemperature = 0,
    OutdoorTemperature = 1,
    AbsoluteHumidity = 2,
    RelativeHumidity = 3,
    WindSpeed = 4,
}
export interface Data {
    port: number;
    value: number;
    date: number;
}
export declare class Descriptor {
    id: string;
    description: string;
    category: Category;
    accuracy?: number;
    resolution?: number;
    maxSampleRate?: number;
}
export interface SensorState {
    desc: Descriptor;
    samples: SensorData[];
}
export declare class SensorData {
    private port;
    private value;
    private date;
    constructor(port?: number, value?: number);
    getValue(): number;
    valid(): boolean;
    setValue(value: number): void;
    setPort(port: number): void;
    getPort(): number;
    timestamp(): number;
    isConnected(): boolean;
}
