/*
 * GET home page.
 */
import express = require('express');
const router: express.Router = express.Router();
import Temper8 = require('../models/temper8');

router.get('/', (_req: express.Request, res: express.Response) => {
    const sensorData: Temper8.Sensor[] = Temper8.Device.getSensorData();
    res.render('index', {
        title: 'Temperatur',
        port0: sensorData[0].port(), value0: sensorData[0].value(),
        port1: sensorData[1].port(), value1: sensorData[1].value(),
        port2: sensorData[2].port(), value2: sensorData[2].value(),
        port3: sensorData[3].port(), value3: sensorData[3].value(),
    });
});

export default router;
