// import { WS_ORIGIN } from './config';


// import cors from 'cors';
import express from 'express';
// import expressWs from 'express-ws';
import http from 'http';
import path = require('path');
import WebSocket from 'ws';

import route_api from './routes/api';
import route_index from './routes/index';
import route_settings from './routes/settings';

import * as BrowserService from './models/browser-service';

import { USBController } from './models/usb-controller';

import { log } from './logger';
const app = express();
// const app = expressWs(express()).app;
// const app: express.Express = express();
// TODO: CORS hardening
// const corsOptions: cors.CorsOptions = {
//     origin: WS_ORIGIN,
// };

// app.use(cors(corsOptions));
// app.disable('etag');

USBController.initializeDevices();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', route_index);
app.use('/api', route_api);
app.use('/settings', route_settings);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     if (req) {
//         // To be implemented
//     }
//     if (res) {
//         // To be implemented
//     }
//     const err: any = new Error('Not Found at server');
//     err['status'] = 404;
//     next(err);
// });


// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use((err: any, req: any, res: any, next: any) => {
//         res.status(err['status'] || 500);
//         res.render('error', {
//             message: err.message,
//             error: err});
//         if (next) {
//             // to be implemented
//         }
//         if (req) {
//             // to be implemented
//         }
//     });
// }

// production error handler
// no stack traces leaked to user
// app.use((err: any, req: any, res: any, next: any) => {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}});
//     if (next) {
//         // to be implemented
//     }
//     if (req) {
//         // to be implemented
//     }
// });


// export const httpServer: http.Server = http.createServer(app);

// export const wss = new WebSocket.Server( {server: httpServer, clientTracking: true} );

// wss.on('connection', (ws: WebSocket, request: http.IncomingMessage): void  => {
//     const ip = request.headers['x-forwarded-for'];
//     log.info('wss.on: new websocket connection from client: ' + JSON.stringify(ip));
//     // ws.send({descr: 'hello', data: 'Hello world from device'});

//     ws.on('close', (ws: WebSocket, code: number, reason: string): void => {
//       log.info('ws.on: Websocket: '+ ws.url + ' + code: ' + code +  'reason: ' + reason);
//     });

//     ws.on('message', (data: Buffer): void => {
//       log.debug('ws.on: received message: ' + data.toString());
//     });

//     ws.on('error', (): void => {
//         log.debug('ws.on: Error: ');
//       });
//   });


// wss.on('error', (): void  => {
//     log.error('wss.on: error received');
// });

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });
wss.on('connection', (ws: WebSocket, request: http.IncomingMessage): void  => {
    log.info('app.ws: new connection url/headers: ' + ws.url + '/' + JSON.stringify(request.headers));


    ws.on('close', (ws: WebSocket, code: number, reason: string): void => {
      log.info('ws.on: Websocket: '+ ws.url + ' + code: ' + code +  'reason: ' + reason);
    });

    ws.on('message', (data: Buffer): void => {
      log.debug('ws.on: received message: ' + data.toString());

      BrowserService.parseInboundMessage(ws, data);

    });

    ws.on('error', (): void => {
        log.debug('ws.on: Error: ');
      });
} );
const server = httpServer.listen(process.env.PORT || 80, () => {
    log.info('iTemper device listening on port ' + server.address().port);
});

export default server;
