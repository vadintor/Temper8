"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SensorStateLogger = (function () {
    function SensorStateLogger(sensorStates) {
        this.logging = false;
        console.log('--- SensorStateLogger:', JSON.stringify(sensorStates));
        this.logging = false;
        this.sensorStates = sensorStates;
        for (var _i = 0, _a = this.sensorStates; _i < _a.length; _i++) {
            var state = _a[_i];
            console.log('+++ SensorStateLogger.state.addSensorDataListener');
            state.addSensorDataListener(this.onSensorDataReceived.bind(this));
        }
    }
    SensorStateLogger.prototype.startLogging = function () {
        console.log('+++ SensorStateLogger.startLogging');
        this.logging = true;
    };
    SensorStateLogger.prototype.stopLogging = function () {
        this.logging = false;
    };
    SensorStateLogger.prototype.onSensorDataReceived = function (sensorData) {
        console.log('--- onSensorDataReceived, logging:', this.logging);
        if (this.logging) {
            for (var _i = 0, sensorData_1 = sensorData; _i < sensorData_1.length; _i++) {
                var data = sensorData_1[_i];
                var now = new Date(data.timestamp());
                console.log(now.toISOString());
            }
        }
    };
    return SensorStateLogger;
}());
exports.SensorStateLogger = SensorStateLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TZXJ2aWNlcy9zZW5zb3Itc3RhdGUtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0E7SUFJSSwyQkFBWSxZQUEyQjtRQUYvQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxDQUFnQixVQUFpQixFQUFqQixLQUFBLElBQUksQ0FBQyxZQUFZLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO1lBQWhDLElBQU0sS0FBSyxTQUFBO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1lBQ2pFLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDckU7SUFDTCxDQUFDO0lBRU0sd0NBQVksR0FBbkI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVNLHVDQUFXLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUNPLGdEQUFvQixHQUE1QixVQUE2QixVQUF3QjtRQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLEdBQUcsQ0FBQyxDQUFlLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVTtnQkFBeEIsSUFBTSxJQUFJLG1CQUFBO2dCQUNYLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQ25DO1FBQ0wsQ0FBQztJQUVMLENBQUM7SUFDTCx3QkFBQztBQUFELENBaENBLEFBZ0NDLElBQUE7QUFoQ1ksOENBQWlCIiwiZmlsZSI6IlNlcnZpY2VzL3NlbnNvci1zdGF0ZS1sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZW5zb3JEYXRhIH0gZnJvbSAnLi4vbW9kZWxzL3NlbnNvci1kYXRhJztcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuLi9tb2RlbHMvc2Vuc29yLXN0YXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZW5zb3JTdGF0ZUxvZ2dlciB7XHJcbiAgICBwcml2YXRlIHNlbnNvclN0YXRlczogU2Vuc29yU3RhdGVbXTtcclxuICAgIHByaXZhdGUgbG9nZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNlbnNvclN0YXRlczogU2Vuc29yU3RhdGVbXSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0gU2Vuc29yU3RhdGVMb2dnZXI6JywgSlNPTi5zdHJpbmdpZnkoc2Vuc29yU3RhdGVzKSk7XHJcbiAgICAgICAgdGhpcy5sb2dnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZW5zb3JTdGF0ZXMgPSBzZW5zb3JTdGF0ZXM7XHJcbiAgICAgICAgZm9yIChjb25zdCBzdGF0ZSBvZiB0aGlzLnNlbnNvclN0YXRlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnKysrIFNlbnNvclN0YXRlTG9nZ2VyLnN0YXRlLmFkZFNlbnNvckRhdGFMaXN0ZW5lcicpO1xyXG4gICAgICAgICAgICBzdGF0ZS5hZGRTZW5zb3JEYXRhTGlzdGVuZXIodGhpcy5vblNlbnNvckRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0TG9nZ2luZygpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnKysrIFNlbnNvclN0YXRlTG9nZ2VyLnN0YXJ0TG9nZ2luZycpO1xyXG4gICAgICAgIHRoaXMubG9nZ2luZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3BMb2dnaW5nKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9nZ2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblNlbnNvckRhdGFSZWNlaXZlZChzZW5zb3JEYXRhOiBTZW5zb3JEYXRhW10pOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tIG9uU2Vuc29yRGF0YVJlY2VpdmVkLCBsb2dnaW5nOicsIHRoaXMubG9nZ2luZyk7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nZ2luZykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGEgb2Ygc2Vuc29yRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXAoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAobm93LnRvSVNPU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
