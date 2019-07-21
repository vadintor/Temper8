"use strict";
exports.__esModule = true;
var SensorCategory;
(function (SensorCategory) {
    SensorCategory[SensorCategory["Temperature"] = 0] = "Temperature";
    SensorCategory[SensorCategory["AbsoluteHumidity"] = 1] = "AbsoluteHumidity";
    SensorCategory[SensorCategory["RelativeHumidity"] = 2] = "RelativeHumidity";
    SensorCategory[SensorCategory["WindSpeed"] = 3] = "WindSpeed";
})(SensorCategory = exports.SensorCategory || (exports.SensorCategory = {}));
var SensorAttributes = /** @class */ (function () {
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
