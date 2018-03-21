export declare class Sensor {
    private _port;
    private _value;
    constructor(port?: number, value?: number);
    value(): number;
    valid(): boolean;
    setValue(value: number): void;
    setPort(port: number): void;
    port(): number;
    isConnected(): boolean;
}
