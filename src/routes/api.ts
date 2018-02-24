/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();
import Temper8 = require('../models/temper8');

router.get('/', (_req: express.Request, res: express.Response) => {
    const sensorData: Temper8.Sensor[] = Temper8.Device.getSensorData();
    res.setHeader('Content-Type', 'application/json');
        // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.send(JSON.stringify(sensorData));
});

export default router;

