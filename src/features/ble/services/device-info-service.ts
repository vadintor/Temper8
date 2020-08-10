
import bleno from 'bleno';

import { AvailableWiFiCharacteristic } from '../characteristics/available-wifi-characteristic';
import { CurrentWiFiCharacteristic } from '../characteristics/current-wifi-characteristic';
import { DeviceCharacteristic } from '../characteristics/device-characteristic';

export class DeviceInfoService extends bleno.PrimaryService {
  public static UUID = 'fff1';
  constructor() {
    super({
      uuid: DeviceInfoService.UUID,
      characteristics: [
        new AvailableWiFiCharacteristic(),
        new DeviceCharacteristic(),
        new CurrentWiFiCharacteristic(),
      ],
    });
  }
}

