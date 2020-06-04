"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SensorCategory;
(function (SensorCategory) {
    SensorCategory["Temperature"] = "Temperature";
    SensorCategory["AbsoluteHumidity"] = "AbsoluteHumidity";
    SensorCategory["RelativeHumidity"] = "RelativeHumidity";
    SensorCategory["WindSpeed"] = "WindSpeed";
})(SensorCategory = exports.SensorCategory || (exports.SensorCategory = {}));
var SensorAttributes = (function () {
    function SensorAttributes(SN, model, category, accuracy, resolution, maxSampleRate) {
        this.SN = SN;
        this.model = model;
        this.category = category;
        this.accuracy = accuracy;
        this.resolution = resolution;
        this.maxSampleRate = maxSampleRate;
    }
    return SensorAttributes;
}());
exports.SensorAttributes = SensorAttributes;
//# sourceMappingURL=sensor-attributes.js.map