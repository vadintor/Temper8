"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var Temper8 = require("../models/temper8");
router.get('/', function (_req, res) {
    var sensorData = Temper8.Device.getSensorData();
    res.render('index', {
        title: 'Temperatur',
        port0: sensorData[0].port(), value0: sensorData[0].value(),
        port1: sensorData[1].port(), value1: sensorData[1].value(),
        port2: sensorData[2].port(), value2: sensorData[2].value(),
        port3: sensorData[3].port(), value3: sensorData[3].value(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map