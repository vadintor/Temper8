// import bleno from 'bleno';
// import * as util from 'util';
import { log } from '../../../core/logger';
import { Settings } from '../../../core/settings';
import { BaseCharacteristic, ReadResponse, WriteResponse } from './base-characteristic';
import { DeviceData, isDeviceDataValid } from './characteristic-data';

export class DeviceCharacteristic extends  BaseCharacteristic{
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84542';
  constructor() {
    super(DeviceCharacteristic.UUID, 'Device settings',  ['read', 'write']);
  }
  handleReadRequest(): Promise<ReadResponse> {
    return new Promise((resolve) => {
      const data =  {
        name: '',
        deviceID: '123',
        key: '',
        color: '',
      };
      data.key = Settings.get(Settings.SHARED_ACCESS_KEY).toString();
      data.name =  Settings.get(Settings.SERIAL_NUMBER).toString();
      data.color =  Settings.get(Settings.COLOR).toString();
      resolve({result: this.RESULT_SUCCESS, data});
    });
  }

  handleWriteRequest(raw: unknown): Promise<WriteResponse> {
    return new Promise((resolve) => {
      if (isDeviceDataValid(raw)) {
        const deviceData = raw as DeviceData;
        this.update(Settings.SERIAL_NUMBER, deviceData.name);
        this.update(Settings.SHARED_ACCESS_KEY, deviceData.key);
        if (deviceData.color ) {
          this.update(Settings.COLOR, deviceData.color);
        }
        resolve({result: this.RESULT_SUCCESS});
      } else {
        resolve({result: this.RESULT_UNLIKELY_ERROR});
      }
    });
  }

  update(setting: string, value: string) {
    Settings.update(setting, value, (updated: boolean) => {
      if (updated) {
        log.info('device-characteristic: ' + setting + ' updated, value= ' + value);
      } else {
        log.error('device-characteristic: ' + setting + ' not updated');
      }
    });
  }
}
