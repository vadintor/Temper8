"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category;
(function (Category) {
    Category[Category["IndoorTemperature"] = 0] = "IndoorTemperature";
    Category[Category["OutdoorTemperature"] = 1] = "OutdoorTemperature";
    Category[Category["AbsoluteHumidity"] = 2] = "AbsoluteHumidity";
    Category[Category["RelativeHumidity"] = 3] = "RelativeHumidity";
    Category[Category["WindSpeed"] = 4] = "WindSpeed";
})(Category = exports.Category || (exports.Category = {}));
var Descriptor = (function () {
    function Descriptor() {
    }
    return Descriptor;
}());
exports.Descriptor = Descriptor;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsaUVBQWlCLENBQUE7SUFDakIsbUVBQWtCLENBQUE7SUFDbEIsK0RBQWdCLENBQUE7SUFDaEIsK0RBQWdCLENBQUE7SUFDaEIsaURBQVMsQ0FBQTtBQUNiLENBQUMsRUFOVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQU1uQjtBQU9EO0lBQUE7SUFPQSxDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLGdDQUFVO0FBZXZCO0lBSUksb0JBQVksSUFBaUIsRUFBRSxLQUFvQjtRQUF2QyxxQkFBQSxFQUFBLFFBQWdCLENBQUM7UUFBRSxzQkFBQSxFQUFBLFlBQW9CO1FBSDNDLFNBQUksR0FBVyxDQUFDLENBQUMsQ0FBQztRQUNsQixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBQ3JCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFFckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVNLDZCQUFRLEdBQWY7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRU0sMEJBQUssR0FBWjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRU0sNkJBQVEsR0FBZixVQUFnQixLQUFhO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSw0QkFBTyxHQUFkLFVBQWUsSUFBWTtRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSw4QkFBUyxHQUFoQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxnQ0FBVyxHQUFsQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQXZDQSxBQXVDQyxJQUFBO0FBdkNZLGdDQUFVIiwiZmlsZSI6Im1vZGVscy9zZW5zb3ItZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIENhdGVnb3J5IHtcclxuICAgIEluZG9vclRlbXBlcmF0dXJlLFxyXG4gICAgT3V0ZG9vclRlbXBlcmF0dXJlLFxyXG4gICAgQWJzb2x1dGVIdW1pZGl0eSxcclxuICAgIFJlbGF0aXZlSHVtaWRpdHksXHJcbiAgICBXaW5kU3BlZWQsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YSB7XHJcbiAgICBwb3J0OiBudW1iZXI7IC8vIG1hdGNoZXMgU2Vuc29yLmlkIGFib3ZlXHJcbiAgICB2YWx1ZTogbnVtYmVyO1xyXG4gICAgZGF0ZTogbnVtYmVyO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBEZXNjcmlwdG9yIHtcclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgY2F0ZWdvcnk6IENhdGVnb3J5O1xyXG4gICAgcHVibGljIGFjY3VyYWN5PzogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlc29sdXRpb24/OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbWF4U2FtcGxlUmF0ZT86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZW5zb3JTdGF0ZSB7XHJcbiAgICBkZXNjOiBEZXNjcmlwdG9yO1xyXG4gICAgc2FtcGxlczogU2Vuc29yRGF0YVtdO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNlbnNvckRhdGEgIHtcclxuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyID0gLTE7ICAgICAvLyBUaGUgc2Vuc29yIGtub3dzIHdoaWNoIHBvcnQgaXQgaXMgY29ubmVjdGVkIHRvLlxyXG4gICAgcHJpdmF0ZSB2YWx1ZTogbnVtYmVyID0gODUuMDsgICAgICAgICAvLyBUZW1wZXJhdHVyZSB2YWx1ZSBpbiBkZWdyZWVzIGNlbHNpdXNcclxuICAgIHByaXZhdGUgZGF0ZTogbnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKHBvcnQ6IG51bWJlciA9IC0xLCB2YWx1ZTogbnVtYmVyID0gODUuMCkge1xyXG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlIDwgODUuMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQb3J0KHBvcnQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBvcnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0aW1lc3RhbXAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3J0ID49IDA7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==
