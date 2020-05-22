export declare type SettingValue = string | number;
export interface Setting {
    name: string;
    label: string;
    value: SettingValue;
    defaultValue: SettingValue;
    text: string;
    readonly: boolean;
}
export declare type Listener = (setting: Setting) => void;
export interface SettingListener {
    settingName: string;
    publish: Listener;
}
export declare class Settings {
    private static map;
    private static listeners;
    static SERIAL_NUMBER: string;
    static AZURE_CONNECTION_STRING: string;
    static CONSOLE_LEVEL: string;
    static ERROR_LEVEL: string;
    static ERROR_LOG_FILE: string;
    static HOSTNAME: string;
    static ITEMPER_URL: string;
    static POLL_INTERVAL: string;
    static WS_ORIGIN: string;
    static WS_URL: string;
    static SHARED_ACCESS_KEY: string;
    static READONLY: boolean;
    static initialize(): void;
    static onChange(settingName: string, publish: Listener): void;
    private static publish;
    static all(): Setting[];
    static add(name: string, label: string, value: SettingValue | undefined, defaultValue: SettingValue, text: string, readonly: boolean): void;
    static create(name: string, label: string, value: SettingValue | undefined, defaultValue: SettingValue, text: string, readonly: boolean): Setting;
    static get(name: string): Setting;
    static toNum(setting: Setting): number;
    toString(setting: Setting): string;
    static has(name: string): boolean;
    static set(setting: Setting): void;
    static update(name: string, value: SettingValue, callback: (updated: boolean) => void): void;
    static forEach(callbackfn: (setting: Setting) => void): void;
}
