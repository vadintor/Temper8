import bleno from 'bleno';

export class CPUSpeedCharacteristic extends bleno.Characteristic {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';
  constructor() {
    super({
      uuid: CPUSpeedCharacteristic.UUID,
      properties: ['read'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'CPU Speed',
      })],
    });
  }
  public onReadRequest(offset: any, callback: any) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      callback(this.RESULT_SUCCESS, Buffer.from('110%', 'utf-8'));
    }
  }
}
