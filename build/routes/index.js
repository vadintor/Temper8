"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var cors_1 = __importDefault(require("cors"));
var logger_1 = require("./../logger");
router.get('/', cors_1.default(), function (_req, res) {
    logger_1.log.debug('GET /');
    res.sendFile('./index.html');
});
exports.default = router;
//# sourceMappingURL=index.js.map