import bleno from 'bleno';
import { log } from '../../core/logger';
import { DeviceInfoService } from './services/device-info-service';
const deviceInfoService = new DeviceInfoService();

export const AdvertisedName = 'itemperBLE';

export function initBLE() {
  bleno.on('stateChange', (state: any) => {
    log.info(`initBLE.on -> stateChange: ${state}`);

    if (state === 'poweredOn') {
      bleno.startAdvertising(AdvertisedName, [
        DeviceInfoService.UUID,
      ]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', (error: Error) => {
    log.info(`initBLE.on -> advertisingStart: ${error ? 'error ' + error : 'success'}`);
    if (!error) {
      bleno.setServices([deviceInfoService], (error: Error) => {
        error ? log.error('initBLE.setServices: error=' +  error) : log.info('initBLE.setServices: success');
      });
    }
  });
}

