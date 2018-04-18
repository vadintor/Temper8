"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var logger_1 = require("./../logger");
var usb_sensor_manager_1 = require("../models/usb-sensor-manager");
router.post('/', function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    var response = [];
    if (_req.query.level) {
        var level = _req.query.level;
        logger_1.log.debug('/settings _req.query.level:', level);
        if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
            logger_1.log.info('/settings log level:', level);
            logger_1.setLevel(level);
            response.push({ level: level });
            res.status(200);
        }
        else {
            logger_1.log.debug('/settings level not set:', level);
        }
    }
    if (_req.query.interval) {
        try {
            var interval = _req.query.interval;
            logger_1.log.debug('/settings _req.query.interval:', interval);
            if (1 <= interval && interval <= 60 * 60) {
                var ms = 1000 * interval;
                logger_1.log.debug('/settings interval ms:', ms);
                usb_sensor_manager_1.USBSensorManager.setPollingInterval(ms);
                logger_1.log.info('/settings interval set:', interval);
                response.push({ interval: interval });
                res.status(200);
            }
            else {
                logger_1.log.debug('/settings interval out of range:', _req.query.interval);
            }
        }
        catch (e) {
            logger_1.log.debug('/settings interval not set:', _req.query.interval);
        }
    }
    res.send(response);
});
exports.default = router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBb0M7QUFDcEMsSUFBTSxNQUFNLEdBQW1CLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoRCxzQ0FBNEM7QUFFNUMsbUVBQWdFO0FBR2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQUMsSUFBcUIsRUFBRSxHQUFxQjtJQUMxRCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBTSxRQUFRLEdBQVUsRUFBRSxDQUFDO0lBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNuQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMvQixZQUFHLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsWUFBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QyxpQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7WUFDdkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixZQUFHLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDTCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQztZQUNELElBQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQzdDLFlBQUcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQU0sRUFBRSxHQUFXLElBQUksR0FBRyxRQUFRLENBQUM7Z0JBQ25DLFlBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3hDLHFDQUFnQixDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QyxZQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxVQUFBLEVBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixZQUFHLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkUsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1IsWUFBRyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7SUFDTCxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBHRVQgc2Vuc29yIGRhdGEuXHJcbiAqL1xyXG5pbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3Qgcm91dGVyOiBleHByZXNzLlJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcbmltcG9ydCB7IGxvZywgc2V0TGV2ZWwgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcblxyXG5pbXBvcnQgeyBVU0JTZW5zb3JNYW5hZ2VyIH0gZnJvbSAnLi4vbW9kZWxzL3VzYi1zZW5zb3ItbWFuYWdlcic7XHJcblxyXG5cclxucm91dGVyLnBvc3QoJy8nLCAoX3JlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpID0+IHtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwNCk7XHJcbiAgICBjb25zdCByZXNwb25zZTogYW55W10gPSBbXTtcclxuXHJcbiAgICBpZiAoX3JlcS5xdWVyeS5sZXZlbCkge1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gX3JlcS5xdWVyeS5sZXZlbDtcclxuICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBfcmVxLnF1ZXJ5LmxldmVsOicsIGxldmVsKTtcclxuICAgICAgICBpZiAobGV2ZWwgJiYgKGxldmVsID09PSAnZGVidWcnIHx8IGxldmVsID09PSAnaW5mbycgfHwgbGV2ZWwgPT09ICd3YXJuJyB8fCBsZXZlbCA9PT0gJ2Vycm9yJykpIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJy9zZXR0aW5ncyBsb2cgbGV2ZWw6JywgbGV2ZWwpO1xyXG4gICAgICAgICAgICBzZXRMZXZlbChsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnB1c2goe2xldmVsfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBsZXZlbCBub3Qgc2V0OicsIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKF9yZXEucXVlcnkuaW50ZXJ2YWwpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbDogbnVtYmVyID0gX3JlcS5xdWVyeS5pbnRlcnZhbDtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCcvc2V0dGluZ3MgX3JlcS5xdWVyeS5pbnRlcnZhbDonLCBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIGlmICgxIDw9IGludGVydmFsICYmIGludGVydmFsIDw9IDYwICogNjApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1zOiBudW1iZXIgPSAxMDAwICogaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBpbnRlcnZhbCBtczonLCBtcyk7XHJcbiAgICAgICAgICAgICAgICBVU0JTZW5zb3JNYW5hZ2VyLnNldFBvbGxpbmdJbnRlcnZhbChtcyk7XHJcbiAgICAgICAgICAgICAgICBsb2cuaW5mbygnL3NldHRpbmdzIGludGVydmFsIHNldDonLCBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5wdXNoKHtpbnRlcnZhbH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCcvc2V0dGluZ3MgaW50ZXJ2YWwgb3V0IG9mIHJhbmdlOicsIF9yZXEucXVlcnkuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnL3NldHRpbmdzIGludGVydmFsIG5vdCBzZXQ6JywgX3JlcS5xdWVyeS5pbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5zZW5kKHJlc3BvbnNlKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcblxyXG4iXX0=
