import { AZURE_CONNECTION_STRING, CONSOLE_LEVEL, ERROR_LEVEL, ERROR_LOG_FILE,
    HOSTNAME, ITEMPER_URL, POLL_INTERVAL, WS_ORIGIN, WS_URL
    } from '../config';

import { log } from './../logger';

type SettingValue = string | number;

export interface Setting {
    name: string;
    value: SettingValue;
    defaultValue: SettingValue;
    text: string;
}

export class Settings {
    private static map = new Map<string, Setting>();

    public static initializeSettings() {
        Settings.add('AZURE_CONNECTION_STRING', AZURE_CONNECTION_STRING, '',
            'Connection string to AZURE IOT HUB');
        Settings.add('CONSOLE_LEVEL', CONSOLE_LEVEL, 'info',
            'Event level logged on console: error | info | debug');
        Settings.add('ERROR_LEVEL', ERROR_LEVEL, 'error',
            'Event level logged on file: error | info | debug');
        Settings.add('ERROR_LOG_FILE', ERROR_LOG_FILE, 'itemper-error.log',
            'Name of the log file. You find it in the application root directory');
        Settings.add('HOSTNAME', HOSTNAME, '',
            'This device \'s hostname');
        Settings.add('ITEMPER_URL', ITEMPER_URL, 'https://itemper.io',
            'The device use\'s this URL when connecting to iTemper');
        Settings.add('POLL_INTERVAL', POLL_INTERVAL, 5_000,
            'Interval (ms) between polling the sensors');
        Settings.add('WS_ORIGIN', WS_ORIGIN, 'https://itemper.io',
            'Origon used when connecting to iTemper with WebSockets');
        Settings.add('WS_URL', WS_URL, 'wss://itemper.io',
            'WebSocket URL to iTemper');
    }

    public static all(): Setting[] {
        const allSettings: Setting[] = [];
        Settings.forEach(setting=> allSettings.push(setting));
        return allSettings;
    }
    public static add(name: string, value: SettingValue | undefined, defaultValue: SettingValue, text: string) {
        const setting = Settings.create(name, value, defaultValue, text);
        Settings.set(setting);
    }
    public static create(   name: string,
                            value: SettingValue | undefined,
                            defaultValue: SettingValue,
                            text: string): Setting {
        if (value) {
            return  {name, value, defaultValue, text};
        } else {
            return {name, value: defaultValue, defaultValue, text};
            log.info('Settings.create: setting' + name + ' value undefined, uses default:' + defaultValue);
        }

    }
    public static get(name: string): Setting | undefined {
        return Settings.map.get(name);
    }

    public static value(setting: Setting): number {
        return Number(setting.value);
    }

    public static has(name: string): boolean {
        return Settings.map.has(name);
    }
    public static set(setting: Setting) {
        Settings.map.set(setting.name, setting);
        log.info ('Settings.set: ' + JSON.stringify(setting));
    }

    public static forEach(callbackfn: (setting: Setting) => void) {
        Settings.map.forEach(callbackfn);
    }
}

