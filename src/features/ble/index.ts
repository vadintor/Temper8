import bleno from 'bleno';
import { log } from '../../core/logger';
import { DeviceInfoService } from './services/device-info-service';
const deviceInfoService = new DeviceInfoService();

const AdvertisedName = 'itemperBLE';

export function init() {
  bleno.on('stateChange', (state: any) => {
    log.info(`ble.init.on(stateChange): ${state}`);

    if (state === 'poweredOn') {
      bleno.startAdvertising(AdvertisedName, [
        DeviceInfoService.UUID,
      ]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', (error: Error) => {
    log.info(`ble.init.on(advertisingStart): ${error ? 'error ' + error : 'success'}`);
    if (!error) {
      bleno.setServices([deviceInfoService], (error: Error) => {
        error ? log.error('ble.init.on(advertisingStart): error=' +  error) : log.info('initBLE.setServices: success');
      });
    }
  });
}

