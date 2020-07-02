import bleno from 'bleno';
import { log } from '../../logger';
import { Settings } from '../../models/settings';
export class DeviceCharacteristic extends bleno.Characteristic {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84542';
  constructor() {
    super({
      uuid: DeviceCharacteristic.UUID,
      properties: ['read', 'write'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'Device settings',
      })],
    });
  }

  onReadRequest(offset: any, callback: any) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      callback(this.RESULT_SUCCESS, Buffer.from('iTemper ab'));
    }
  }

  onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void): void {
    log.debug('device-characteristic.onWriteRequest: offset=' + offset);
    log.debug('device-characteristic.onWriteRequest: withoutResponse=' + withoutResponse);
    log.debug('device-characteristic.onWriteRequest: data=' + decode(data));

    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
      log.error('device-characteristic.onWriteRequest: RESULT_ATTR_NOT_LONG');
    } else {
      const value = JSON.parse(decode(data));
      if (value.key) {
        Settings.update(Settings.SHARED_ACCESS_KEY, value.key, (updated) => {
          if (updated) {
            log.info('device-characteristic.onWriteRequest: SHARED_ACCESS_KEY updated by bluetooth client');
            callback(this.RESULT_SUCCESS);
          } else {
            log.error('device-characteristic.onWriteRequest: SHARED_ACCESS_KEY not updated. Read-only?');
            callback(this.RESULT_UNLIKELY_ERROR);
          }
        });
      } else {
        log.error('device-characteristic.onWriteRequest: SHARED_ACCESS_KEY not in write request data.');
        callback(this.RESULT_UNLIKELY_ERROR);
      }
    }
  }
}

// helper function to decode message sent from peripheral
export function decode(buf: BufferSource): string {
  log.debug('device-characteristic.decode');
  const dec = new TextDecoder('utf-8');
  return dec.decode(buf);
}
export function encode(value: string ): BufferSource {
  log.debug('device-characteristic.encode');
  const enc = new TextEncoder();
  return enc.encode(value);
}


