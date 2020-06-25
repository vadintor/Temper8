import bleno from 'bleno';
import si from 'systeminformation';

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
      si.cpu()
        .then((data: any) => {
          callback(this.RESULT_SUCCESS, Buffer.from(data.speed, 'utf-8'));
        })
        .catch((err: Error) => {
          console.log(err);
        });
    }
    }
}
