/*
 * GET home page.
 */
import express = require('express');
const router: express.Router = express.Router();
import { SensorState } from '../models/sensor-state';
import { USBSensorManager } from '../models/usb-sensor-manager';

router.get('/', (_req: express.Request, res: express.Response) => {
    const sensorState: SensorState[] = USBSensorManager.getSensorStates();
    const sensorData = sensorState[0].getSensorData();

    res.render('index', {
        title: 'Temperatur',
        port0: sensorData[0].getPort(),
        value0: sensorData[0].getValue(),
        date0: new Date(sensorData[0].timestamp()).toTimeString()
    });
});

export default router;
