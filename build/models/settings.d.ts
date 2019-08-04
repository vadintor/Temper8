declare type SettingValue = string | number;
export interface Setting {
    name: string;
    value: SettingValue;
    defaultValue: SettingValue;
    text: string;
}
export declare class Settings {
    private static map;
    static initializeSettings(): void;
    static all(): Setting[];
    static add(name: string, value: SettingValue | undefined, defaultValue: SettingValue, text: string): void;
    static create(name: string, value: SettingValue | undefined, defaultValue: SettingValue, text: string): Setting;
    static get(name: string): Setting | undefined;
    static value(setting: Setting): number;
    static has(name: string): boolean;
    static set(setting: Setting): void;
    static forEach(callbackfn: (setting: Setting) => void): void;
}
export {};
