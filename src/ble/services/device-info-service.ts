
import bleno from 'bleno';

import { CPUManufacturerCharacteristic } from '../characteristics/cpu-manufacturer-characteristic';
import { CPUSpeedCharacteristic } from '../characteristics/cpu-speed-characteristic';

export class DeviceInfoService extends bleno.PrimaryService {
  public static UUID = 'fff1';
  constructor() {
    super({
      uuid: DeviceInfoService.UUID,
      characteristics: [
        new CPUManufacturerCharacteristic(),
        new CPUSpeedCharacteristic(),
      ],
    });
  }
}

