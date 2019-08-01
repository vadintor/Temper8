
import * as dotenv from 'dotenv';
import * as os from 'os';
dotenv.config();

export const ITEMPER_URL = process.env.ITEMPER_URL;
export const WS_URL = process.env.WS_URL;
export const WS_ORIGIN = process.env.WS_ORIGIN;
export const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
export const POLL_INTERVAL = process.env.POLL_INTERVAL;
export const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE;
export const ERROR_LEVEL = process.env.ERROR_LEVEL;
export const CONSOLE_LEVEL = process.env.CONSOLE_LEVEL;
export const HOSTNAME = os.hostname();
