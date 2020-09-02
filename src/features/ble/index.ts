import bleno from 'bleno';
import { log } from '../../core/logger';
import { Setting, Settings } from '../../core/settings';
import { DeviceInfoService } from './services/device-info-service';
const deviceInfoService = new DeviceInfoService();
let advertising = false;
let pendingStart = false;
const namePrefix = 'itemper ';

function AdvertisedName() {
  return namePrefix + Settings.get(Settings.SERIAL_NUMBER).value.toString();
}
function startAdvertising() {
  const name = AdvertisedName();
  log.info('ble.startAdvertising name=' + name);
  bleno.startAdvertising(name, [DeviceInfoService.UUID]);
}
function stopAdvertising() {
  log.info('ble.stopAdvertising');
  bleno.stopAdvertising();
}
export function init() {
  Settings.onChange(Settings.SERIAL_NUMBER, (setting: Setting) => {
    log.info('ble.init: new SERIAL_NUMBER=' + setting.value.toString());
    if (advertising) {
      pendingStart = true;
      stopAdvertising();
    }
  });
  bleno.on('stateChange', (state: any) => {
    log.info(`ble.init.on(stateChange): ${state}`);
    if (state === 'poweredOn') {
      startAdvertising();
    } else {
      stopAdvertising();
    }
  });
  bleno.on('advertisingStart', (error?: Error) => {
    if (!error) {
      bleno.setServices([deviceInfoService], (error: Error) => {
        if (error) {
          log.error('ble.init.setServices: error=' +  error);
        } else {
          log.info('ble.init.setServices: advertising deviceInfoService=' +  deviceInfoService);
          advertising = true;
        }
      });
    } else {
      log.error('ble.init.advertisingStart:' + error.message);
    }
  });
  bleno.on('advertisingStop', () => {
    log.error('ble.advertisingStop');
    advertising = false;
    if (pendingStart) {
      pendingStart = false;
      startAdvertising();
    }
  });
  bleno.on('accept', (address: string) => {
    log.info('ble.accept address=' + address);
  });
  bleno.on('mtuChange', (mtu: number) => {
    log.info('ble.mtuChange mtu=' + mtu);
  });
  bleno.on('disconnect', (clientAddress: string) => {
    log.info('ble.disconnect clientAddress=' + clientAddress);
  });
  bleno.on('advertisingStartError', (err: Error) => {
    log.error('ble.advertisingStartError err=' + err.message);
  });
  bleno.on('servicesSet', (err?: Error | null) => {
    if (!err) {
      log.info('ble.servicesSet');
    } else {
      log.error('ble.servicesSet err=' + err.message);
    }
  });
  bleno.on('servicesSetError', (err: Error) => {
    log.error('ble.servicesSetError err=' + err.message);
  });
  bleno.on('rssiUpdate', (rssi: number) => {
    log.info('ble.rssiUpdate rssi=' + rssi);
  });
}

