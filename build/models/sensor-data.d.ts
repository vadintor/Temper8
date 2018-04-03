export declare class SensorData {
    private port;
    private value;
    private date;
    constructor(port?: number, value?: number);
    getValue(): number;
    valid(): boolean;
    setValue(value: number): void;
    updateValue(value: number): void;
    setPort(port: number): void;
    getPort(): number;
    timestamp(): number;
    isConnected(): boolean;
}
