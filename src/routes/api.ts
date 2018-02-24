/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();
import Temper8 = require('../models/temper8');

router.get('/', (_req: express.Request, res: express.Response) => {
    const sensorData: Temper8.Sensor[] = Temper8.Device.getSensorData();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(sensorData));
});

export default router;

