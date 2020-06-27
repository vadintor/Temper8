import bleno from 'bleno';

import { DeviceInfoService } from './services/device-info-service';
const deviceInfoService = new DeviceInfoService();

export const AdvertisedName = 'itemperBLE';

export function initBLE() {
  bleno.on('stateChange', (state: any) => {
    console.log(`on -> stateChange: ${state}`);

    if (state === 'poweredOn') {
      bleno.startAdvertising(AdvertisedName, [
        DeviceInfoService.UUID,
      ]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', (error: Error) => {
    console.log(
      `on -> advertisingStart: ${error ? 'error ' + error : 'success'}`,
    );
    if (!error) {
      bleno.setServices([deviceInfoService], (error: Error) => {
        console.log(`setServices: ${error ? 'error ' + error : 'success'}`);
      });
    }
  });
}

