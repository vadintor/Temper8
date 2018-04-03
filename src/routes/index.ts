/*
 * GET home page.
 */
import express = require('express');
const router: express.Router = express.Router();
import { SensorData } from '../models/sensor-data';

import { USBSensorManager } from '../models/usb-sensor-manager';

import { log } from './../logger';

router.get('/', (_req: express.Request, res: express.Response) => {

    const sensorLogger = USBSensorManager.getLoggers()
        .find(logger=> logger.getState !== undefined);

    const data: SensorData = new SensorData();

    if (sensorLogger && sensorLogger.getState()) {
        const sensorData = sensorLogger.getState().getSensorData();
        log.debug('--- / get, state: ', JSON.stringify(sensorLogger.getState()));
        log.debug('--- / get, data:', JSON.stringify(sensorData));
        Object.assign(data, sensorData);
    }


    res.render('index', {
        title: 'Temperatur',
        port0: data.getPort(),
        value0: data.getValue(),
        date0: new Date(data.timestamp()).toTimeString(),
    });
});

export default router;
