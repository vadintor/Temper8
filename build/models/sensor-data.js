"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SensorData = (function () {
    function SensorData(port, value) {
        if (port === void 0) { port = -1; }
        if (value === void 0) { value = 85.0; }
        this.port = -1;
        this.value = 85.0;
        this.date = 0;
        this.port = port;
        this.value = value;
        this.date = Date.now();
    }
    SensorData.prototype.getValue = function () {
        return this.value;
    };
    SensorData.prototype.valid = function () {
        return this.value < 85.0;
    };
    SensorData.prototype.setValue = function (value) {
        this.value = value;
        this.date = Date.now();
    };
    SensorData.prototype.updateValue = function (value) {
        this.value = value;
    };
    SensorData.prototype.setPort = function (port) {
        this.port = port;
    };
    SensorData.prototype.getPort = function () {
        return this.port;
    };
    SensorData.prototype.timestamp = function () {
        return this.date;
    };
    SensorData.prototype.isConnected = function () {
        return this.port >= 0;
    };
    return SensorData;
}());
exports.SensorData = SensorData;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUlJLG9CQUFZLElBQWlCLEVBQUUsS0FBb0I7UUFBdkMscUJBQUEsRUFBQSxRQUFnQixDQUFDO1FBQUUsc0JBQUEsRUFBQSxZQUFvQjtRQUgzQyxTQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFXLElBQUksQ0FBQztRQUNyQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSw2QkFBUSxHQUFmO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVNLDBCQUFLLEdBQVo7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVNLDZCQUFRLEdBQWYsVUFBZ0IsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQ00sZ0NBQVcsR0FBbEIsVUFBbUIsS0FBYTtRQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBQ00sNEJBQU8sR0FBZCxVQUFlLElBQVk7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLDRCQUFPLEdBQWQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sOEJBQVMsR0FBaEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sZ0NBQVcsR0FBbEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVMLGlCQUFDO0FBQUQsQ0F6Q0EsQUF5Q0MsSUFBQTtBQXpDWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvc2Vuc29yLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU2Vuc29yRGF0YSAge1xyXG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXIgPSAtMTsgICAgIC8vIFRoZSBzZW5zb3Iga25vd3Mgd2hpY2ggcG9ydCBpdCBpcyBjb25uZWN0ZWQgdG8uXHJcbiAgICBwcml2YXRlIHZhbHVlOiBudW1iZXIgPSA4NS4wOyAgICAgICAgIC8vIFRlbXBlcmF0dXJlIHZhbHVlIGluIGRlZ3JlZXMgY2Vsc2l1c1xyXG4gICAgcHJpdmF0ZSBkYXRlOiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3IocG9ydDogbnVtYmVyID0gLTEsIHZhbHVlOiBudW1iZXIgPSA4NS4wKSB7XHJcbiAgICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPCA4NS4wO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdXBkYXRlVmFsdWUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRQb3J0KHBvcnQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBvcnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0aW1lc3RhbXAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3J0ID49IDA7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==
