
import wifi from 'node-wifi';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { BaseCharacteristic } from './base-characteristic';
import { isWiFiRequestValid, WiFiData, WiFiRequest } from './characteristic-data';

export class CurrentWiFiCharacteristic extends  BaseCharacteristic<WiFiData> {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';
  constructor() {
    super(CurrentWiFiCharacteristic.UUID, 'Current WiFi',  ['read', 'write']);
  }
  handleReadRequest(): Promise<WiFiData> {
    return new Promise((resolve, reject) => {
      wifi.getCurrentConnections()
      .then((networks: WiFi[]) => {
          const { ssid, security, quality, channel } = networks.length > 0
          ? networks[0]
          : {ssid: '', security: '', quality: 0, channel: 0};
          const data: WiFiData = { ssid, security, quality, channel };
          log.info('current-wifi-characteristic.handleReadRequest: successfully retrieving network data='
          + JSON.stringify(data));
          resolve(data);
      })
      .catch((e: Error) => {
        log.error('current-wifi-characteristic.handleReadRequest - error retrieving wireless networks', e);
        reject(e);
      });
    });
  }

  handleWriteRequest(raw: unknown): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (isWiFiRequestValid(raw)) {
        const network = raw as WiFiRequest;
        wifi.connect(network.ssid, network.password)
        .then(() => {
          log.info('current-wifi-characteristic.handleWriteRequest - successfully connected to WiFi: ' + network.ssid);
          resolve(true);
        })
        .catch((e: any) => {
          log.error('current-wifi-characteristic.handleWriteRequest - cannot connect to wireless network: '
                + network.ssid);
          reject (e);
        });
      } else {
        log.error('current-wifi-characteristic.handleWriteRequest - invalid WiFi request');
        reject (false);
      }
    });
  }
}
