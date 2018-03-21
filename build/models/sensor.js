"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sensor = (function () {
    function Sensor(port, value) {
        if (port === void 0) { port = -1; }
        if (value === void 0) { value = 85.0; }
        this._port = -1;
        this._value = 85.0;
        this._port = port;
        this._value = value;
    }
    Sensor.prototype.value = function () {
        return this._value;
    };
    Sensor.prototype.valid = function () {
        return this._value < 85.0;
    };
    Sensor.prototype.setValue = function (value) {
        this._value = value;
    };
    Sensor.prototype.setPort = function (port) {
        this._port = port;
    };
    Sensor.prototype.port = function () {
        return this._port;
    };
    Sensor.prototype.isConnected = function () {
        return this._port >= 0;
    };
    return Sensor;
}());
exports.Sensor = Sensor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFJSSxnQkFBWSxJQUFpQixFQUFFLEtBQW9CO1FBQXZDLHFCQUFBLEVBQUEsUUFBZ0IsQ0FBQztRQUFFLHNCQUFBLEVBQUEsWUFBb0I7UUFIM0MsVUFBSyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFHMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFLLEdBQUw7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsc0JBQUssR0FBTDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQseUJBQVEsR0FBUixVQUFTLEtBQWE7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVELHdCQUFPLEdBQVAsVUFBUSxJQUFZO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxxQkFBSSxHQUFKO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELDRCQUFXLEdBQVg7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNMLGFBQUM7QUFBRCxDQWhDQSxBQWdDQyxJQUFBO0FBaENZLHdCQUFNIiwiZmlsZSI6Im1vZGVscy9zZW5zb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU2Vuc29yIHtcclxuICAgIHByaXZhdGUgX3BvcnQ6IG51bWJlciA9IC0xOyAgICAgLy8gVGhlIHNlbnNvciBrbm93cyB3aGljaCBwb3J0IGl0IGlzIGNvbm5lY3RlZCB0by5cclxuICAgIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgPSA4NS4wOyAgICAgICAgIC8vIFRlbXBlcmF0dXJlIHZhbHVlIGluIGRlZ3JlZXMgY2Vsc2l1c1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvcnQ6IG51bWJlciA9IC0xLCB2YWx1ZTogbnVtYmVyID0gODUuMCkge1xyXG4gICAgICAgIHRoaXMuX3BvcnQgPSBwb3J0O1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlIDwgODUuMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3J0KHBvcnQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3BvcnQgPSBwb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIHBvcnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9ydDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9ydCA+PSAwO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
