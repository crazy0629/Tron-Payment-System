"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUL = exports.TRON_API_KEY = exports.usdt_contract_address = exports.EVENT_SERVER = exports.SOLIDITY_NODE = exports.FULL_NODE = exports.USDT_TOKEN_ADDRESS_TRON_TESTNET = exports.USDT_TOKEN_ADDRESS_TRON = exports.TRON_TESTNET_WEB3PROVIDER = exports.TRON_MAINNET_WEB3PROVIDER = exports.SERVER_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SERVER_PORT = process.env.SERVER_PORT || 8000;
exports.TRON_MAINNET_WEB3PROVIDER = "https://api.trongrid.io";
exports.TRON_TESTNET_WEB3PROVIDER = "https://api.shasta.trongrid.io";
exports.USDT_TOKEN_ADDRESS_TRON = process.env.USDT_TOKEN_ADDRESS_TRON || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
exports.USDT_TOKEN_ADDRESS_TRON_TESTNET = process.env.USDT_TOKEN_ADDRESS_TRON_TESTNET ||
    "TNUC9Qb1rRpS5CbWLuyY1q8yfSc1DBogQW";
exports.FULL_NODE = process.env.FULL_NODE || "https://api.trongrid.io";
exports.SOLIDITY_NODE = process.env.SOLIDITY_NODE || "https://api.trongrid.io";
exports.EVENT_SERVER = process.env.EVENT_SERVER || "https://api.trongrid.io";
exports.usdt_contract_address = process.env.USDT_TOKEN_ADDRESS_TRON ||
    "41A614F803B6FD780986A42C78EC9C7F77E6DED1";
exports.TRON_API_KEY = process.env.TRON_API_KEY || "d42e51d0-1bfa-4ff6-9ea6-d34c18a3359d";
exports.MUL = process.env.MUL || "https://tron-calc-fee.vercel.app/api/setData";
