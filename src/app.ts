import { Settings } from './core/settings';

import { log } from './core/logger';

import express from 'express';

import http from 'http';
import path from 'path';
import * as WebSocket from 'ws';

import route_sensors from './routes/sensors';
import route_settings from './routes/settings';

import * as clientService from './features/client-service/client-service';

import { Device } from './features/device/device';
import { USBController } from './features/sensors/usb-controller';

// import { initBLE } from './features/ble';

import * as ruuvi from './features/ruuvi/ruuvi-tag';
import * as logService from './features/sensors/sensor-log-service';

import * as wifi from './features/wifi/wifi-data';

import * as shutdown from './core/shutdown';
// Init itemper modules
// initBLE();

Settings.init();
logService.init();
Device.init();
USBController.init();
wifi.init();
ruuvi.init();

// Init itemper device server
const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// REST API - for debugging
app.use('/sensors', route_sensors);
app.use('/settings', route_settings);

const httpServer = http.createServer(app);

// Clients connect with web sockets

const wss = new WebSocket.Server({ server: httpServer });
clientService.init(wss);

// open service
const port = process.env.PORT || 80;
const server = httpServer.listen(port, () => {
    log.info('iTemper device listening on port ' + port);
});

shutdown.init(server);

export default server;
