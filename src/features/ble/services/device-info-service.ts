
import bleno from 'bleno';

import { getUuid, UUID_Designator} from '../ble-uuid';
import { AvailableWiFiCharacteristic } from '../characteristics/available-wifi-characteristic';
import { CurrentWiFiCharacteristic } from '../characteristics/current-wifi-characteristic';
import { DeviceCharacteristic } from '../characteristics/device-characteristic';

export class DeviceInfoService extends bleno.PrimaryService {
  public static UUID = getUuid(UUID_Designator.PrimaryService);
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

