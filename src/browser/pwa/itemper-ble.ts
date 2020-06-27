import { CPUManufacturerCharacteristic } from '../../ble/characteristics/cpu-manufacturer-characteristic';
import { CPUSpeedCharacteristic } from '../../ble/characteristics/cpu-speed-characteristic';
import { DeviceInfoService } from '../../ble/services/device-info-service';

export class ItemperBLE {

  private device: any = undefined;
  private cpuVendor: any = undefined;
  private cpuSpeed: any = undefined;

  constructor() {
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  /* the Device characteristic providing CPU information */
  async setDeviceCharacteristic() {
    const service = await this.device.gatt.getPrimaryService(DeviceInfoService.UUID);
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
        },
      ],
      optionalServices: [DeviceInfoService.UUID],
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

/* Disconnect from peripheral and update UI */
function disconnect() {
  itemperBLE.disconnect();
  document.getElementById('not-connected').classList.remove('hidden');
  document.getElementById('container').classList.add('hidden');
}

const itemperBLE = new ItemperBLE();
const toggle: HTMLInputElement = <HTMLInputElement> document.getElementById('toggle');

/* connect to peripheral, load data and add event listeners */
document
  .getElementById('btn-connect')
  .addEventListener('click', async event => {
      try {
          await itemperBLE.request();
          await itemperBLE.connect();
          await itemperBLE.setDeviceCharacteristic();
          document.getElementById('not-connected').classList.add('hidden');
          document.getElementById(
              'vendor',
          ).textContent = await itemperBLE.readCPUVendor();
          document.getElementById(
              'speed',
          ).textContent = await itemperBLE.readCPUSpeed();

          toggle.addEventListener('change', (e: any) => {
              if (e.target.checked) {
                  toggle.disabled = true;
                  setTimeout(() => {
                      toggle.disabled = false;
                  }, 1000);
              } else {
                  toggle.disabled = true;
                  setTimeout(() => {
                      toggle.disabled = false;
                  }, 1000);
              }
          });

          document.getElementById('container').classList.remove('hidden');
      } catch (error) {
          console.log(error.message);
      }
  });
