"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("./models/settings");
var logger_1 = require("./logger");
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var path = require("path");
var WebSocket = __importStar(require("ws"));
var api_1 = __importDefault(require("./routes/api"));
var index_1 = __importDefault(require("./routes/index"));
var settings_2 = __importDefault(require("./routes/settings"));
var BrowserService = __importStar(require("./models/browser-service"));
var device_1 = require("./models/device");
var usb_controller_1 = require("./models/usb-controller");
var app = express_1.default();
settings_1.Settings.initialize();
device_1.Device.initialize();
usb_controller_1.USBController.initialize();
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.use('/settings', settings_2.default);
var httpServer = http_1.default.createServer(app);
var wss = new WebSocket.Server({ server: httpServer });
BrowserService.initOutboundMessageService(wss);
wss.on('connection', function (ws, request) {
    logger_1.log.info('app.ws: new connection url/headers: ' + ws.url + '/' + JSON.stringify(request.headers));
    ws.on('close', function (ws, code, reason) {
        logger_1.log.info('ws.on: Websocket: ' + ws.url + ' + code: ' + code + 'reason: ' + reason);
    });
    ws.on('message', function (data) {
        logger_1.log.debug('ws.on: received message: ' + data.toString());
        BrowserService.parseInboundMessage(ws, data);
    });
    ws.on('error', function () {
        logger_1.log.debug('ws.on: Error: ');
    });
});
var server = httpServer.listen(process.env.PORT || 80, function () {
    logger_1.log.info('iTemper device listening on port ' + server.address().port);
});
exports.default = server;
//# sourceMappingURL=app.js.map