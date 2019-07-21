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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUlJLG9CQUFZLElBQWlCLEVBQUUsS0FBb0I7UUFBdkMscUJBQUEsRUFBQSxRQUFnQixDQUFDO1FBQUUsc0JBQUEsRUFBQSxZQUFvQjtRQUgzQyxTQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFXLElBQUksQ0FBQztRQUNyQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSw2QkFBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTSwwQkFBSyxHQUFaO1FBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRU0sNkJBQVEsR0FBZixVQUFnQixLQUFhO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFDTSxnQ0FBVyxHQUFsQixVQUFtQixLQUFhO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFDTSw0QkFBTyxHQUFkLFVBQWUsSUFBWTtRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sOEJBQVMsR0FBaEI7UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLGdDQUFXLEdBQWxCO1FBQ0ksT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQXpDQSxBQXlDQyxJQUFBO0FBekNZLGdDQUFVIiwiZmlsZSI6Im1vZGVscy9zZW5zb3ItZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBTZW5zb3JEYXRhICB7XHJcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlciA9IC0xOyAgICAgLy8gVGhlIHNlbnNvciBrbm93cyB3aGljaCBwb3J0IGl0IGlzIGNvbm5lY3RlZCB0by5cclxuICAgIHByaXZhdGUgdmFsdWU6IG51bWJlciA9IDg1LjA7ICAgICAgICAgLy8gVGVtcGVyYXR1cmUgdmFsdWUgaW4gZGVncmVlcyBjZWxzaXVzXHJcbiAgICBwcml2YXRlIGRhdGU6IG51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0OiBudW1iZXIgPSAtMSwgdmFsdWU6IG51bWJlciA9IDg1LjApIHtcclxuICAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB2YWxpZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA8IDg1LjA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZhbHVlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1cGRhdGVWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFBvcnQocG9ydDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UG9ydCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRpbWVzdGFtcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvcnQgPj0gMDtcclxuICAgIH1cclxuXHJcbn1cclxuIl19
