
import wifi from 'node-wifi';
import { stringify } from '../../../core/helpers';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { getUuid, UUID_Designator} from '../ble-uuid';
import { BaseCharacteristic } from './base-characteristic';
import { isWiFiRequestValid, WiFiData, WiFiRequest } from './characteristic-data';

export class CurrentWiFiCharacteristic extends  BaseCharacteristic<WiFiData> {
  public static UUID = getUuid(UUID_Designator.CurrentWiFi);
  constructor() {
    super(CurrentWiFiCharacteristic.UUID, 'Current WiFi',  ['read', 'write']);
  }
  async handleReadRequest(): Promise<WiFiData> {
    return new Promise((resolve, reject) => {
      wifi.getCurrentConnections()
      .then((networks: WiFi[]) => {
          const { ssid, security, quality, channel } = networks.length > 0
          ? networks[0]
          : {ssid: '', security: '', quality: 0, channel: 0};
          const data: WiFiData = { ssid, security, quality, channel };
          log.info('current-wifi-characteristic.handleReadRequest: successfully retrieving network data='
          + stringify(data));
          resolve(data);
      })
      .catch((e: Error) => {
        log.error('current-wifi-characteristic.handleReadRequest - error retrieving wireless networks', e);
        reject(e);
      });
    });
  }

 async handleWriteRequest(raw: unknown): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (isWiFiRequestValid(raw)) {
        const network = raw as WiFiRequest;
        wifi.connect(network)
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
