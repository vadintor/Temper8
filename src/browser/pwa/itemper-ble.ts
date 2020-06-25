import { CPUManufacturerCharacteristic } from '../../ble/characteristics/cpu-manufacturer-characteristic';
import { CPUSpeedCharacteristic } from '../../ble/characteristics/cpu-speed-characteristic';
import { CPUInfoService } from '../../ble/services/device-info-service';

export class ItemperBLE {

  private device: any = undefined;
  private cpuVendor: any = undefined;
  private cpuSpeed: any = undefined;

  constructor() {
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  /* the Device characteristic providing CPU information */
  async setDeviceCharacteristic() {
    const service = await this.device.gatt.getPrimaryService(CPUInfoService.ID);
    const vendor = await service.getCharacteristic(
      CPUManufacturerCharacteristic.UUID,
    );
    this.cpuVendor = vendor;

    const speed = await service.getCharacteristic(
      CPUSpeedCharacteristic.UUID,
    );
    this.cpuSpeed = speed;
  }

  /* request connection to a device */
  async request() {
    const options = {
      filters: [
        {
          name: 'itemperBLE',
        }
      ],
      optionalServices: [CPUInfoService.ID],
    };
    if (navigator.bluetooth === undefined) {
      alert('Sorry, Your device does not support Web BLE!');
      return;
    }
    this.device = await navigator.bluetooth.requestDevice(options);
    if (!this.device) {
      throw new Error('No device selected');
    }
    this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
  }

  /* connect to device */
  async connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    await this.device.gatt.connect();
  }

  /* read CPU manufacturer */
  async readCPUVendor() {
    const vendor = await this.cpuVendor.readValue();
    return decode(vendor);
  }

  /* read CPU speed */
  async readCPUSpeed() {
    const speed = await this.cpuSpeed.readValue();
    return decode(speed);
  }

  /* disconnect from peripheral */
  disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.disconnect();
  }

  /* handler to run when device successfully disconnects */
  onDisconnected() {
    alert('Device is disconnected.');
    location.reload();
  }
}

/* helper function to decode message sent from peripheral */
function decode(buf: any) {
  const dec = new TextDecoder('utf-8');
  return dec.decode(buf);
}
