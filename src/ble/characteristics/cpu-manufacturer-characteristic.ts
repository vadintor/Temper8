import bleno from 'bleno';

export class CPUManufacturerCharacteristic extends bleno.Characteristic {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84542';
  constructor() {
    super({
      uuid: CPUManufacturerCharacteristic.UUID,
      properties: ['read'],
    });
  }

  onReadRequest(offset: any, callback: any) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      callback(this.RESULT_SUCCESS, Buffer.from('iTemper ab'));
    }
  }
}

