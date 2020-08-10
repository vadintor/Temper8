
import wifi from 'node-wifi';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { BaseCharacteristic, ReadResponse, WriteResponse } from './base-characteristic';
import { isWiFiRequestValid, WiFiData, WiFiRequest } from './characteristic-data';

export class WiFiCharacteristic extends  BaseCharacteristic{
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';
  constructor() {
    super(WiFiCharacteristic.UUID, 'WiFi settings',  ['read', 'write']);
  }
  handleReadRequest(): Promise<ReadResponse> {
    return new Promise((resolve) => {
      const data =  {
        current:  {
          ssid: '',
          security: '',
          channel: 0,
          quality: 0,
        },
        available: Array<WiFiData>(),
      };
      Promise.all ( [wifi.getCurrentConnections, wifi.scan ] )
      .then((networks: WiFi[][]) => {
        if (networks[0].length > 0) {
          const {ssid, security, channel, quality} = networks[0][0]; // Just takes the first one and hope for the best
          data.current = { ssid, security, channel, quality };
        }
        networks[1].forEach((network: WiFi) => {
          data.available.push({
            ssid: network.ssid,
            security: network.security,
            channel: network.channel,
            quality: network.quality,
          });
        });
        log.info('WiFiCharacteristic.handleReadRequest: data=' + JSON.stringify(data));
        resolve({result: this.RESULT_SUCCESS, data});
      })
      .catch(() => resolve({result: this.RESULT_UNLIKELY_ERROR}));
    });
  }

  handleWriteRequest(raw: unknown): Promise<WriteResponse> {
    return new Promise((resolve) => {
      if (isWiFiRequestValid(raw)) {
        const network = raw as WiFiRequest;
        wifi.connect(network.ssid, network.password)
        .then(() => resolve({ result: this.RESULT_SUCCESS}))
        .catch(() => resolve ({result: this.RESULT_UNLIKELY_ERROR}));
      }
    });
  }
}
