/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();

import { USBSensorManager } from '../models/usb-sensor-manager';

import { log, setLevel } from './../logger';

router.get('/', (_req: express.Request, res: express.Response) => {

    const sensorLogger =
        USBSensorManager.getLoggers()
        .find(logger=> logger.getState !== undefined);

    res.setHeader('Content-Type', 'application/json');
    if (sensorLogger) {
        const sensorData = sensorLogger.getState().getSensorData();
        log.debug('--- /api.get, state: ', JSON.stringify(sensorLogger.getState()));

        log.debug('--- /api.get, data:', JSON.stringify(sensorData));
        res.send(JSON.stringify(sensorData));

    } else {
        res.send(JSON.stringify([]));
        console.log('--- /api.get:', JSON.stringify([]));
    }

});

router.post('/debug', (_req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    const level = _req.query.level;
    if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
        setLevel(level);
        log.info('/debug log level:', level);
        res.status(200).send({level});
    } else {
        log.info('/debug log level not set:', level);
        res.sendStatus(404);
    }

});

export default router;

