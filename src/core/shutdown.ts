import http from 'http';
import { log } from './logger';
export function init(server: http.Server) {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

    signals.forEach((signal) => {
        process.on(signal , () => {
            log.info(signal + ' received: closing application');
            closeApp();
        });
    });

    function closeApp() {
        server.close(() => {
            log.info('HTTP server closed');
        });
    }
}
