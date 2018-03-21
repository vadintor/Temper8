/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();
import { SensorState } from '../models/sensor-state';
import {USBSensorManager} from '../models/usb-sensor-manager';

router.get('/', (_req: express.Request, res: express.Response) => {
    const sensorState: SensorState[] = USBSensorManager.getSensorStates();
    res.setHeader('Content-Type', 'application/json');

    if (sensorState) {
        const sensorData = sensorState[0].getSensorData();
        res.send(JSON.stringify(sensorData));
        console.log('/api.get:', JSON.stringify(sensorData));

    } else {
        res.send(JSON.stringify([]));
        console.log('/api.get:', JSON.stringify([]));
    }

});

export default router;

