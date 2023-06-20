"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
/**
 * Starting our application
 */
const server = http_1.default.createServer(app_1.default);
server.listen(app_1.default.get("port"), () => console.log(`>> Server is running on ${app_1.default.get("port")}`));
