/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();
import cors from 'cors';

import { USBController } from '../models/usb-controller';

import { log } from './../logger';

router.get('/', cors(), (_req: express.Request, res: express.Response) => {

    const sensorLogger =
    USBController.getLoggers().find(logger=> logger.getState !== undefined);

    res.setHeader('Content-Type', 'application/json');
    if (sensorLogger) {
        const sensorData = sensorLogger.getState().getSensorData();
        log.debug('--- /api.get, state: ', sensorLogger.getState());

        log.debug('--- /api.get, data:', sensorData);
        res.status(200).send(JSON.stringify(sensorData));

    } else {
        res.status(200).send(JSON.stringify([]));
        console.log('--- /api.get:', JSON.stringify([]));
    }

});


export default router;

