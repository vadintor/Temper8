
import wifi from 'node-wifi';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { BaseCharacteristic, ReadResponse, WriteResponse } from './base-characteristic';
import { isWiFiRequestValid, WiFiData, WiFiRequest } from './characteristic-data';

export class CurrentWiFiCharacteristic extends  BaseCharacteristic {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';
  constructor() {
    super(CurrentWiFiCharacteristic.UUID, 'Current WiFi',  ['read', 'write']);
  }
  handleReadRequest(): Promise<ReadResponse> {
    return new Promise((resolve) => {
      const data =  {
        current:  {
          ssid: 'no network found',
          security: '',
          channel: 0,
          quality: 0,
        },
        available: Array<WiFiData>(),
      };
      wifi.getCurrentConnections()
      .then((networks: WiFi[]) => {
        if (networks.length > 0) {
          const {ssid, security, channel, quality} = networks[0]; // Just takes the first one and hope for the best
          data.current = { ssid, security, channel, quality };
        }
        log.info('current-wifi-characteristic.handleReadRequest: successfully retrieving network data='
              + JSON.stringify(data));
        resolve({result: this.RESULT_SUCCESS, data});
      })
      .catch((e: Error) => {
        log.error('current-wifi-characteristic.handleReadRequest - error retrieving wireless networks', e);
        resolve({result: this.RESULT_SUCCESS, data});
      });
    });
  }

  handleWriteRequest(raw: unknown): Promise<WriteResponse> {
    return new Promise((resolve) => {
      if (isWiFiRequestValid(raw)) {
        const network = raw as WiFiRequest;
        wifi.connect(network.ssid, network.password)
        .then(() => {
          log.info('current-wifi-characteristic.handleWriteRequest - successfully connected to WiFi: ' + network.ssid);
          resolve({ result: this.RESULT_SUCCESS});
        })
        .catch(() => {
          log.error('current-wifi-characteristic.handleWriteRequest - cannot connect to wireless network: '
                + network.ssid);
          resolve ({result: this.RESULT_UNLIKELY_ERROR});
        });
      } else {
        log.error('current-wifi-characteristic.handleWriteRequest - invalid WiFi request');
        resolve ({result: this.RESULT_UNLIKELY_ERROR});
      }
    });
  }
}
