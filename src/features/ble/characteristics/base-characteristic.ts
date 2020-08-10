import bleno from 'bleno';
import * as util from 'util';
import { log } from '../../../core/logger';

// Copied from bleno because it was not exported
type Property = 'read' | 'write' | 'indicate' | 'notify' | 'writeWithoutResponse';

// Responses on read and write requests
export interface ReadResponse {
    result: number;
    data?: any;
}
export interface WriteResponse {
    result: number;
}
export abstract class BaseCharacteristic extends bleno.Characteristic {
  constructor(UUID: string, descriptorValue: string, properties: ReadonlyArray<Property>) {
    super({
      uuid: UUID,
      properties,
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: descriptorValue,
      })],
    });
  }

  abstract handleReadRequest(): Promise<ReadResponse>;

  onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else {
        this.handleReadRequest()
        .then((response) =>  callback(response.result, Buffer.from(JSON.stringify(response.data))));
    }
  }

  abstract handleWriteRequest(raw: unknown): Promise<WriteResponse>;

  onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void): void {
    log.debug('base-characteristic.onWriteRequest: offset=' + offset);
    log.debug('base-characteristic.onWriteRequest: withoutResponse=' + withoutResponse);
    log.debug('base-characteristic.onWriteRequest: data=' + decode(data));

    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
      log.error('base-characteristic.onWriteRequest: RESULT_ATTR_NOT_LONG');
    } else {
      try {
        const raw = JSON.parse(decode(data));
        this.handleWriteRequest(raw)
        .then((response) => {
            log.info('base-characteristic.onWriteRequest: ' + response.result);
            callback(response.result);
        });
      } catch {
        log.error('base-characteristic.onWriteRequest: Cannot parse BLE write request data.');
        callback(this.RESULT_UNLIKELY_ERROR);
      }

    }
  }
}

// helper function to decode message sent from peripheral
export function decode(buf: Buffer): string {
  log.debug('base-characteristic.decode');
  const dec = new util.TextDecoder('utf-8');
  return dec.decode(buf);
}
export function encode(value: string ): BufferSource {
  log.debug('base-characteristic.encode');
  const enc = new util.TextEncoder();
  return enc.encode(value);
}
