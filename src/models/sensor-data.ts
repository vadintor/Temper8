export enum Category {
    IndoorTemperature,
    OutdoorTemperature,
    AbsoluteHumidity,
    RelativeHumidity,
    WindSpeed,
}

export interface Data {
    port: number; // matches Sensor.id above
    value: number;
    date: number;
}
export class Descriptor {
    public id: string;
    public description: string;
    public category: Category;
    public accuracy?: number;
    public resolution?: number;
    public maxSampleRate?: number;
}

export interface SensorState {
    desc: Descriptor;
    samples: SensorData[];
}


export class SensorData  {
    private port: number = -1;     // The sensor knows which port it is connected to.
    private value: number = 85.0;         // Temperature value in degrees celsius
    private date: number = 0;
    constructor(port: number = -1, value: number = 85.0) {
        this.port = port;
        this.value = value;
        this.date = Date.now();
    }

    public getValue(): number {
        return this.value;
    }

    public valid(): boolean {
        return this.value < 85.0;
    }

    public setValue(value: number) {
        this.value = value;
        this.date = Date.now();
    }

    public setPort(port: number) {
        this.port = port;
    }

    public getPort(): number {
        return this.port;
    }

    public timestamp(): number {
        return this.date;
    }

    public isConnected(): boolean {
        return this.port >= 0;
    }

}
