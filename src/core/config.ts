import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as os from 'os';

interface Options {
    _SERIAL_NUMBER?: string;
    _ITEMPER_URL?: string;
    _WS_URL?: string;
    _WS_ORIGIN?: string;
    _AZURE_CONNECTION_STRING?: string;
    _POLL_INTERVAL?: string;
    _ERROR_LOG_FILE?: string;
    _ERROR_LEVEL?: string;
    _CONSOLE_LEVEL?: string;
    _HOSTNAME?: string;
    _SHARED_ACCESS_KEY?: string;
}
class Config {
    private static env: Options;

    constructor() {
        this.reset();
        this.readSharedKey();
    }
    private reset() {
        Config.env = {
            _SERIAL_NUMBER: process.env.SERIAL_NUMBER || os.hostname(),
            _ITEMPER_URL : process.env.ITEMPER_URL,
            _WS_URL : process.env.WS_URL,
            _WS_ORIGIN : process.env.WS_ORIGIN,
            _AZURE_CONNECTION_STRING : process.env.AZURE_CONNECTION_STRING,
            _POLL_INTERVAL : process.env.POLL_INTERVAL,
            _ERROR_LOG_FILE : process.env.ERROR_LOG_FILE,
            _ERROR_LEVEL : process.env.ERROR_LEVEL,
            _CONSOLE_LEVEL : process.env.CONSOLE_LEVEL,
            _HOSTNAME : os.hostname(),
            _SHARED_ACCESS_KEY: process.env.SHARED_ACCESS_KEY,
           };
    }

get SERIAL_NUMBER() { return Config.env._SERIAL_NUMBER || '';}

set SERIAL_NUMBER(value: string) { Config.env._SERIAL_NUMBER=value; }

get ITEMPER_URL(): string { return Config.env._ITEMPER_URL || '';}

get WS_URL(): string { return Config.env._WS_URL || ''; }

get WS_ORIGIN(): string {return Config.env._WS_ORIGIN || '';}

get AZURE_CONNECTION_STRING(): string {return Config.env._AZURE_CONNECTION_STRING || '';}

get POLL_INTERVAL(): number {
    if (!Config.env._POLL_INTERVAL) {
        return 60000;
    } else {
        return +Config.env._POLL_INTERVAL;
    }
}
set POLL_INTERVAL(value: number) {Config.env._POLL_INTERVAL = value.toString();}

get ERROR_LOG_FILE() {return Config.env._ERROR_LOG_FILE;}

get ERROR_LEVEL() {return Config.env._ERROR_LEVEL;}

get CONSOLE_LEVEL() {return Config.env._CONSOLE_LEVEL;}

get HOSTNAME() {return Config.env._HOSTNAME;}

public get SHARED_ACCESS_KEY(): string { return Config.env._SHARED_ACCESS_KEY || '';}

public set SHARED_ACCESS_KEY(value: string) { Config.env._SHARED_ACCESS_KEY=value; this.saveSharedKey(value); }

private sharedKeyFileName = './itemper.json';
private readSharedKey(): void {

    const conf = fs.readJSONSync(this.sharedKeyFileName);
    Config.env._SHARED_ACCESS_KEY = conf.SHARED_ACCESS_KEY || process.env.SHARED_ACCESS_KEY;
    console.debug(chalk.yellow('config.readSharedKey conf=' + JSON.stringify(conf)));
}
public saveSharedKey(key: string): void {
    console.debug(chalk.yellow('config.writeSharedKey writing SHARED_ACCESS_KEY to file'));
    fs.writeJSONSync( this.sharedKeyFileName, { SHARED_ACCESS_KEY:key });
}

}

export const conf = new Config();

