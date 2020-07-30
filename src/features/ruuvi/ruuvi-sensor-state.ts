import { log } from '../../core/logger';
import { Setting, Settings} from '../../core/settings';
import { SensorAttributes } from '../sensors/sensor-attributes';
import { SensorState } from '../sensors/sensor-state';


export class RuuviSensorState extends SensorState {

    constructor(attr: SensorAttributes, private port: number) {
        super(attr);
        this.connectSensors([port]);
        Settings.onChange(Settings.SERIAL_NUMBER, (setting: Setting) => {
            this.attr.SN = setting.value.toString();
            log.info('Ruuvi.settingChanged: SERIAL_NUMBER=' + this.attr.SN);
        });
    }
    public update(value: number) {
        this.updateSensor(this.port, value);
    }
}
