"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, label = winston_1.format.label;
var myFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    return level + ": " + timestamp + " [" + label + "]: " + message;
});
var trans = {
    file: new winston_1.transports.File({ filename: config_1.conf.ERROR_LOG_FILE,
        level: config_1.conf.ERROR_LEVEL }),
    console: new (winston_1.transports.Console)(),
};
exports.log = winston_1.createLogger({
    format: combine(timestamp(), label({ label: 'iTemper-device:' +
            config_1.conf.HOSTNAME }), myFormat),
    exitOnError: false,
    level: config_1.conf.CONSOLE_LEVEL,
    transports: [
        trans.file,
        trans.console,
    ],
});
function setLevel(level) {
    exports.log.transports[1].level = level;
}
exports.setLevel = setLevel;
function getLevel() {
    return exports.log.transports[1].level + '';
}
exports.getLevel = getLevel;
//# sourceMappingURL=logger.js.map