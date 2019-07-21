"use strict";
exports.__esModule = true;
var winston = require("winston");
var transports = {
    file: new winston.transports.File({ filename: 'itemper-error.log', level: 'error' }),
    console: new (winston.transports.Console)()
};
exports.log = new winston.Logger({
    exitOnError: false,
    level: 'info',
    transports: [
        transports.file,
        transports.console,
    ]
});
function setLevel(level) {
    exports.log.transports.console.level = level;
}
exports.setLevel = setLevel;
// let v: winston.LoggerOptions;
// if we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
// logger.add(new winston.transports.Console({
//     format: winston.configure({
//     })
// }));
// }
