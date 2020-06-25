
import bleno from 'bleno';

import { CPUManufacturerCharacteristic } from '../characteristics/cpu-manufacturer-characteristic';
import { CPUSpeedCharacteristic } from '../characteristics/cpu-speed-characteristic';

export class CPUInfoService extends bleno.PrimaryService {
  public static ID = 'fff1';
  constructor() {
    super({
      uuid: CPUInfoService.ID,
      characteristics: [
        new CPUManufacturerCharacteristic(),
        new CPUSpeedCharacteristic(),
      ],
    });
  }
}

