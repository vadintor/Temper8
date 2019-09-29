declare class Config {
    private static env;
    constructor();
    private reset;
    SERIAL_NUMBER: string;
    readonly ITEMPER_URL: string;
    readonly WS_URL: string;
    readonly WS_ORIGIN: string;
    readonly AZURE_CONNECTION_STRING: string;
    POLL_INTERVAL: number;
    readonly ERROR_LOG_FILE: string | undefined;
    readonly ERROR_LEVEL: string | undefined;
    readonly CONSOLE_LEVEL: string | undefined;
    readonly HOSTNAME: string | undefined;
    SHARED_ACCESS_KEY: string;
    private sharedKeyFileName;
    private readSharedKey;
    private saveSharedKey;
}
export declare const conf: Config;
export {};
