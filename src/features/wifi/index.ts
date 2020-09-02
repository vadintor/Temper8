import wifi from 'node-wifi';
import {log} from '../../core/logger';
import {WiFi} from '../device/device-status';

export function init() {
    wifi.init({
        iface: null, // network interface, choose a random wifi interface if set to null
      });
    wifi.getCurrentConnections()
    .then((networks: Partial<WiFi[]> ) => {
        log.info('wifi, current networks' + JSON.stringify(networks));
    })
    .catch((e: Error) => { log.error('wifi, error=' + JSON.stringify(e)); });
}

