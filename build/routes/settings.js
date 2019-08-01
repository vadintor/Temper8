"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var logger_1 = require("./../logger");
var usb_controller_1 = require("../models/usb-controller");
router.post('/', function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    var response = [];
    if (_req.query.level) {
        var level = _req.query.level;
        logger_1.log.debug('/settings _req.query.level: ' + level);
        if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
            logger_1.log.info('/settings log level: ' + level);
            logger_1.setLevel(level);
            response.push({ level: level });
            res.status(200);
        }
        else {
            logger_1.log.debug('/settings level not set: ' + level);
        }
    }
    if (_req.query.interval) {
        try {
            var interval = _req.query.interval;
            logger_1.log.debug('/settings _req.query.interval:' + interval);
            if (1 <= interval && interval <= 60 * 60) {
                var ms = 1000 * interval;
                logger_1.log.debug('/settings interval ms: ' + ms);
                usb_controller_1.USBController.setPollingInterval(ms);
                response.push({ interval: interval });
                res.status(200);
                logger_1.log.info('/settings interval set: ' + interval);
            }
            else {
                logger_1.log.warn('/settings interval out of range: ' + _req.query.interval);
            }
        }
        catch (e) {
            logger_1.log.debug('/settings interval not set: ' + _req.query.interval);
        }
    }
    res.send(response);
});
router.get('/', function (_req, res) {
    var response = [];
    response.push({ level: logger_1.getLevel() });
    response.push({ interval: usb_controller_1.USBController.getPollingInterval() / 1000 });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
});
exports.default = router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBb0M7QUFDcEMsSUFBTSxNQUFNLEdBQW1CLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoRCxzQ0FBc0Q7QUFFdEQsMkRBQXlEO0FBRXpELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQUMsSUFBcUIsRUFBRSxHQUFxQjtJQUMxRCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBTSxRQUFRLEdBQVUsRUFBRSxDQUFDO0lBRTNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDbEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0IsWUFBRyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsRUFBRTtZQUMzRixZQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGlCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztZQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO2FBQU07WUFDSCxZQUFHLENBQUMsS0FBSyxDQUFDLDJCQUEyQixHQUFJLEtBQUssQ0FBQyxDQUFDO1NBQ25EO0tBQ0o7SUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ3JCLElBQUk7WUFDQSxJQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUM3QyxZQUFHLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDdEMsSUFBTSxFQUFFLEdBQVcsSUFBSSxHQUFHLFFBQVEsQ0FBQztnQkFDbkMsWUFBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDMUMsOEJBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFDLENBQUMsQ0FBQztnQkFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsWUFBRyxDQUFDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxRQUFRLENBQUMsQ0FBQzthQUNuRDtpQkFBTTtnQkFDSCxZQUFHLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDeEU7U0FDSjtRQUFDLE9BQU0sQ0FBQyxFQUFFO1lBQ1AsWUFBRyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BFO0tBQ0o7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQyxJQUFxQixFQUFFLEdBQXFCO0lBQ3pELElBQU0sUUFBUSxHQUFVLEVBQUUsQ0FBQztJQUMzQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLGlCQUFRLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRyw4QkFBYSxDQUFDLGtCQUFrQixFQUFFLEdBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUNwRSxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsTUFBTSxDQUFDIiwiZmlsZSI6InJvdXRlcy9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEdFVCBzZW5zb3IgZGF0YS5cclxuICovXHJcbmltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCByb3V0ZXI6IGV4cHJlc3MuUm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuaW1wb3J0IHsgZ2V0TGV2ZWwsIGxvZywgc2V0TGV2ZWwgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcblxyXG5pbXBvcnQgeyBVU0JDb250cm9sbGVyIH0gZnJvbSAnLi4vbW9kZWxzL3VzYi1jb250cm9sbGVyJztcclxuXHJcbnJvdXRlci5wb3N0KCcvJywgKF9yZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSA9PiB7XHJcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDQpO1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueVtdID0gW107XHJcblxyXG4gICAgaWYgKF9yZXEucXVlcnkubGV2ZWwpIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IF9yZXEucXVlcnkubGV2ZWw7XHJcbiAgICAgICAgbG9nLmRlYnVnKCcvc2V0dGluZ3MgX3JlcS5xdWVyeS5sZXZlbDogJyArIGxldmVsKTtcclxuICAgICAgICBpZiAobGV2ZWwgJiYgKGxldmVsID09PSAnZGVidWcnIHx8IGxldmVsID09PSAnaW5mbycgfHwgbGV2ZWwgPT09ICd3YXJuJyB8fCBsZXZlbCA9PT0gJ2Vycm9yJykpIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJy9zZXR0aW5ncyBsb2cgbGV2ZWw6ICcgKyBsZXZlbCk7XHJcbiAgICAgICAgICAgIHNldExldmVsKGxldmVsKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucHVzaCh7bGV2ZWx9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnL3NldHRpbmdzIGxldmVsIG5vdCBzZXQ6ICcgKyAgbGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoX3JlcS5xdWVyeS5pbnRlcnZhbCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsOiBudW1iZXIgPSBfcmVxLnF1ZXJ5LmludGVydmFsO1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBfcmVxLnF1ZXJ5LmludGVydmFsOicgKyBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIGlmICgxIDw9IGludGVydmFsICYmIGludGVydmFsIDw9IDYwICogNjApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1zOiBudW1iZXIgPSAxMDAwICogaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBpbnRlcnZhbCBtczogJyArIG1zKTtcclxuICAgICAgICAgICAgICAgIFVTQkNvbnRyb2xsZXIuc2V0UG9sbGluZ0ludGVydmFsKG1zKTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnB1c2goe2ludGVydmFsfSk7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XHJcbiAgICAgICAgICAgICAgICBsb2cuaW5mbygnL3NldHRpbmdzIGludGVydmFsIHNldDogJyArIGludGVydmFsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvZy53YXJuKCcvc2V0dGluZ3MgaW50ZXJ2YWwgb3V0IG9mIHJhbmdlOiAnICsgIF9yZXEucXVlcnkuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnL3NldHRpbmdzIGludGVydmFsIG5vdCBzZXQ6ICcgKyAgX3JlcS5xdWVyeS5pbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5zZW5kKHJlc3BvbnNlKTtcclxufSk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvJywgKF9yZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogYW55W10gPSBbXTtcclxuICAgIHJlc3BvbnNlLnB1c2goe2xldmVsOiBnZXRMZXZlbCgpfSk7XHJcbiAgICByZXNwb25zZS5wdXNoKHtpbnRlcnZhbDogIFVTQkNvbnRyb2xsZXIuZ2V0UG9sbGluZ0ludGVydmFsKCkvMTAwMH0pO1xyXG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlKTtcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuXHJcbiJdfQ==
