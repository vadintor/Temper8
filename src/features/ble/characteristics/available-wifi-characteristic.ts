
import wifi from 'node-wifi';
import { log } from '../../../core/logger';
import { WiFi } from '../../device/device-status';
import { BaseCharacteristic } from './base-characteristic';
import { WiFiData } from './characteristic-data';

type NetworkList = WiFiData[];
export class AvailableWiFiCharacteristic extends  BaseCharacteristic<NetworkList> {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84540';
  private isSubscription = false;
  private updateValueCallback: any;
  private maxValueSize = 0;
  private Interval = 20_000;
  private timeout: NodeJS.Timeout;

  constructor() {
    super(AvailableWiFiCharacteristic.UUID, 'Available wireless networks',  ['read', 'notify']);
  }
  handleWriteRequest(raw: unknown): Promise<boolean> {
      throw Error('handleWriteRequest not implemented: received' + JSON.stringify(raw));
  }
  handleReadRequest(MaxNetworks: number = 5): Promise<NetworkList> {
    return new Promise((resolve, reject) => {
      wifi.scan()
      .then((networks: WiFi[]) => {
        const sorted = networks.filter((n) => n.ssid !== '')
        .sort((a,b) => b.quality - a.quality)
        .slice(0, networks.length < MaxNetworks ? networks.length : MaxNetworks);
        const data: NetworkList = [];
        sorted.forEach((network: WiFi) => data.push(
          { ssid: network.ssid, security: network.security, quality: network.quality, channel: network.channel}));
        resolve(data);
      })
      .catch((e: Error) => {
        log.error('available-wifi-characteristic.handleReadRequest - error retrieving available WiFi networks', e);
        reject(e);
      });
    });
  }

  onSubscribe(maxValueSize: number, updateValueCallback: (data: any) => void): void {
    log.info('available-wifi-characteristic.onSubscribe: maxValueSize=' + maxValueSize);
    this.isSubscription = true;
    this.updateValueCallback = updateValueCallback;
    this.maxValueSize = maxValueSize;
    this.publish();
    this.timeout = setInterval(() => {
      if (this.isSubscription) {
        this.publish();
      }
    }, this.Interval);
  }
  publish() {
    log.info('available-wifi-characteristic.publish');
    this.handleReadRequest(256)
    .then((networks) => {
      for (const network of networks) {
        const value = Buffer.from(JSON.stringify(network));
        if (value.length > this.maxValueSize) {
          log.error('available-wifi-characteristic.publish: value exceeds maxValueSize ' + value.length);
        } else {
          log.info('available-wifi-characteristic.publish');
          if (this.isSubscription) {
            this.updateValueCallback(value);
          }
        }
      }
    });
  }
   onUnsubscribe(): void {
    log.info('base-characteristic.onUnsubscribe');
    if (this.isSubscription) {
      this.isSubscription = false;
      clearInterval(this.timeout);
    }
  }
}
