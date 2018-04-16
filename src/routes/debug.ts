/*
 * GET sensor data.
 */
import express = require('express');
const router: express.Router = express.Router();
import { log, setLevel } from './../logger';


router.post('/', (_req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    const level = _req.query.level;
    if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
        log.info('/debug log level:', level);
        setLevel(level);
        res.status(200).send({level});
    } else {
        log.info('/debug log level not set:', level);
        res.sendStatus(404);
    }

});

export default router;

