"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var logger_1 = require("./../logger");
router.post('/', function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    var level = _req.query.level;
    if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
        logger_1.setLevel(level);
        logger_1.log.info('/debug log level:', level);
        res.status(200).send({ level: level });
    }
    else {
        logger_1.log.info('/debug log level not set:', level);
        res.sendStatus(404);
    }
});
exports.default = router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBb0M7QUFDcEMsSUFBTSxNQUFNLEdBQW1CLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoRCxzQ0FBNEM7QUFHNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBQyxJQUFxQixFQUFFLEdBQXFCO0lBQzFELEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDbEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixpQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLFlBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osWUFBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBHRVQgc2Vuc29yIGRhdGEuXHJcbiAqL1xyXG5pbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3Qgcm91dGVyOiBleHByZXNzLlJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcbmltcG9ydCB7IGxvZywgc2V0TGV2ZWwgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcblxyXG5cclxucm91dGVyLnBvc3QoJy8nLCAoX3JlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpID0+IHtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICBjb25zdCBsZXZlbCA9IF9yZXEucXVlcnkubGV2ZWw7XHJcbiAgICBpZiAobGV2ZWwgJiYgKGxldmVsID09PSAnZGVidWcnIHx8IGxldmVsID09PSAnaW5mbycgfHwgbGV2ZWwgPT09ICd3YXJuJyB8fCBsZXZlbCA9PT0gJ2Vycm9yJykpIHtcclxuICAgICAgICBzZXRMZXZlbChsZXZlbCk7XHJcbiAgICAgICAgbG9nLmluZm8oJy9kZWJ1ZyBsb2cgbGV2ZWw6JywgbGV2ZWwpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtsZXZlbH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsb2cuaW5mbygnL2RlYnVnIGxvZyBsZXZlbCBub3Qgc2V0OicsIGxldmVsKTtcclxuICAgICAgICByZXMuc2VuZFN0YXR1cyg0MDQpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcblxyXG4iXX0=
