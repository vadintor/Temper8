import { conf } from './config';

import { createLogger, format, Logger, transports} from 'winston';
const { combine, timestamp, printf, label } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level}: ${timestamp} [${label}]: ${message}`;
});

const trans = {
    file: new transports.File({ filename: conf.ERROR_LOG_FILE,
                                level: conf.ERROR_LEVEL }),
    console: new (transports.Console)(),
};

export const log: Logger =  createLogger ({
    format: combine (timestamp(), label ({ label: 'iTemper-device:' +
                                           conf.HOSTNAME}), myFormat),
    exitOnError: false,
    level: conf.CONSOLE_LEVEL,
    transports: [
        trans.file,
        trans.console,
    ],
  });

export function setLevel(level: string): void {
    log.transports[1].level = level;
}

export function getLevel(): string {
  return log.transports[1].level + '';
}
