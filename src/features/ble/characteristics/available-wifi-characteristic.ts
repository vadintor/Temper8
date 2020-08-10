
import wifi from 'node-wifi';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { BaseCharacteristic, ReadResponse, WriteResponse } from './base-characteristic';
import { WiFiData } from './characteristic-data';

export class AvailableWiFiCharacteristic extends  BaseCharacteristic{
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84540';
  constructor() {
    super(AvailableWiFiCharacteristic.UUID, 'Available wireless networks',  ['read']);
  }
  handleWriteRequest(raw: unknown): Promise<WriteResponse> {
      throw Error('handleWriteRequest not implemented: received' + JSON.stringify(raw));
  }
  handleReadRequest(): Promise<ReadResponse> {
    return new Promise((resolve) => {
      wifi.scan()
      .then((networks: WiFi[]) => {
        const data: WiFiData[] = [];
        networks.forEach((network: WiFi) => {
            data.push({
                ssid: network.ssid,
                security: network.security,
                channel: network.channel,
                quality: network.quality,
            });
        });
        log.info('available-wifi-characteristic.handleReadRequest: successfully retrieving networks='
                + JSON.stringify(data));
        resolve({result: this.RESULT_SUCCESS, data});
      })
      .catch((e: Error) => {
        log.error('available-wifi-characteristic.handleReadRequest - error retrieving available WiFi networks', e);
        resolve({result: this.RESULT_UNLIKELY_ERROR});
      });
    });
  }
}
