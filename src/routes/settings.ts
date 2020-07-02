/*
 * GET sensor data.
 */
import cors from 'cors';
import * as express from 'express';
const router: express.Router = express.Router();
import { getLevel, log, setLevel } from '../core/logger';

import { USBController } from '../features/sensors/usb-controller';

router.post('/', cors(), (_req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    const response: any[] = [];

    if (_req.query.level) {
        const level = _req.query.level;
        log.debug('/settings _req.query.level: ' + level);
        if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
            log.info('/settings log level: ' + level);
            setLevel(level);
            response.push({level});
            res.status(200);
        } else {
            log.debug('/settings level not set: ' +  level);
        }
    }

    if (_req.query.interval) {
        try {
            const interval: number = parseInt(<string> _req.query.interval, 10);
            log.debug('/settings _req.query.interval:' + interval);
            if (1 <= interval && interval <= 60 * 60) {
                const ms: number = 1000 * interval;
                log.debug('/settings interval ms: ' + ms);
                USBController.setPollingInterval(ms);
                response.push({interval});
                res.status(200);
                log.info('/settings interval set: ' + interval);
            } else {
                log.warn('/settings interval out of range: ' +  _req.query.interval);
            }
        } catch(e) {
            log.debug('/settings interval not set: ' +  _req.query.interval);
        }
    }

    res.send(response);
});

router.get('/', (_req: express.Request, res: express.Response) => {
    const response: any[] = [];
    response.push({level: getLevel()});
    response.push({interval:  USBController.getPollingInterval()/1000});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
});
export default router;

