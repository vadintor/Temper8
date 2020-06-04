"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var Config = (function () {
    function Config() {
        this.sharedKeyFileName = '.key';
        this.reset();
        this.readSharedKey();
    }
    Config.prototype.reset = function () {
        Config.env = {
            _SERIAL_NUMBER: process.env.SERIAL_NUMBER || os.hostname(),
            _ITEMPER_URL: process.env.ITEMPER_URL,
            _WS_URL: process.env.WS_URL,
            _WS_ORIGIN: process.env.WS_ORIGIN,
            _AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
            _POLL_INTERVAL: process.env.POLL_INTERVAL,
            _ERROR_LOG_FILE: process.env.ERROR_LOG_FILE,
            _ERROR_LEVEL: process.env.ERROR_LEVEL,
            _CONSOLE_LEVEL: process.env.CONSOLE_LEVEL,
            _HOSTNAME: os.hostname(),
            _SHARED_ACCESS_KEY: process.env.SHARED_ACCESS_KEY,
        };
    };
    Object.defineProperty(Config.prototype, "SERIAL_NUMBER", {
        get: function () { return Config.env._SERIAL_NUMBER || ''; },
        set: function (value) { Config.env._SERIAL_NUMBER = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "ITEMPER_URL", {
        get: function () { return Config.env._ITEMPER_URL || ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "WS_URL", {
        get: function () { return Config.env._WS_URL || ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "WS_ORIGIN", {
        get: function () { return Config.env._WS_ORIGIN || ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "AZURE_CONNECTION_STRING", {
        get: function () { return Config.env._AZURE_CONNECTION_STRING || ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "POLL_INTERVAL", {
        get: function () {
            if (!Config.env._POLL_INTERVAL) {
                return 60000;
            }
            else {
                return +Config.env._POLL_INTERVAL;
            }
        },
        set: function (value) { Config.env._POLL_INTERVAL = value.toString(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "ERROR_LOG_FILE", {
        get: function () { return Config.env._ERROR_LOG_FILE; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "ERROR_LEVEL", {
        get: function () { return Config.env._ERROR_LEVEL; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "CONSOLE_LEVEL", {
        get: function () { return Config.env._CONSOLE_LEVEL; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "HOSTNAME", {
        get: function () { return Config.env._HOSTNAME; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "SHARED_ACCESS_KEY", {
        get: function () { this.readSharedKey(); return Config.env._SHARED_ACCESS_KEY || ''; },
        set: function (value) { Config.env._SHARED_ACCESS_KEY = value; this.saveSharedKey(); },
        enumerable: true,
        configurable: true
    });
    Config.prototype.readSharedKey = function () {
        var defaultKey = process.env.SHARED_ACCESS_KEY;
        fs.readFile(path.join(__dirname, this.sharedKeyFileName), 'utf8', function (err, data) {
            if (err) {
                Config.env._SHARED_ACCESS_KEY = defaultKey;
            }
            else {
                try {
                    Config.env._SHARED_ACCESS_KEY = JSON.parse(data).SHARED_ACCESS_KEY;
                }
                catch (e) {
                    Config.env._SHARED_ACCESS_KEY = defaultKey;
                }
            }
        });
    };
    Config.prototype.saveSharedKey = function () {
        fs.writeFile(path.join(__dirname, this.sharedKeyFileName), { SHARED_ACCESS_KEY: Config.env._SHARED_ACCESS_KEY }, 'utf8', function (err) {
            if (err) {
                throw Error();
            }
        });
    };
    return Config;
}());
exports.conf = new Config();
//# sourceMappingURL=config.js.map