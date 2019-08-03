/*
 * GET home page.
 */
import express = require('express');
const router: express.Router = express.Router();

import cors from 'cors';

// import { USBController } from '../models/usb-controller';

import { log } from './../logger';

router.get('/', cors(), (_req: express.Request, res: express.Response) => {
    log.debug ('GET /');
    res.sendFile('./index.html');
    // const sensorLogger = USBController.getLoggers()
    //     .find(logger=> logger.getState !== undefined);


    // if (sensorLogger && sensorLogger.getState()) {
    //     const sensorData = sensorLogger.getState().getSensorData();
    //     const sensorDataString = JSON.stringify(sensorData);
    //     log.debug ('GET / Sensor data found');
    //     res.render('index', {
    //         title: 'Sensor Data',
    //         data: sensorDataString,
    //     });

    // } else {
    //     log.debug ('GET / Sensor data NOT found');
    //     res.render('index', {
    //         title: 'Sensor data',
    //         data: 'not found',
    //     });
    // }

});

export default router;
