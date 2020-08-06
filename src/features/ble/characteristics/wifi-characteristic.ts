import bleno from 'bleno';

export class WiFiCharacteristic extends bleno.Characteristic {
  public static UUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';
  constructor() {
    super({
      uuid: WiFiCharacteristic.UUID,
      properties: ['read', 'write'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'WiFi Settings',
      })],
    });
  }
  public onReadRequest(offset: any, callback: any) {
    const data =  { networks: { current:  {
                                            ssid: 'limited',
                                            security: 'WPA2',
                                            channel: 11,
                                            quality: 78,
                                          },
                                available:[
                                  {
                                    ssid: 'Resin',
                                    security: 'WPA2',
                                    channel: 6,
                                    quality: 67,
                                  },
                                  {
                                    ssid: 'StickoBrinn',
                                    security: 'Open',
                                    channel: 1,
                                    quality: 47,
                                  },
                                ],
                              },
                  };
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      callback(this.RESULT_SUCCESS, Buffer.from(JSON.stringify(data), 'utf-8'));
    }
  }
}
