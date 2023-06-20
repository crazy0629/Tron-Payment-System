"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTronPrivateKeyAndWalletAddress = void 0;
const tronweb_1 = __importDefault(require("tronweb"));
const bip39 = __importStar(require("bip39"));
const bip32 = __importStar(require("bip32"));
const interfaces_1 = require("../interfaces");
const generateTronPrivateKey = (nonce) => __awaiter(void 0, void 0, void 0, function* () {
    const mnemonic = bip39.generateMnemonic();
    const seed = yield bip39.mnemonicToSeed(mnemonic);
    const node = yield bip32.fromSeed(seed);
    const child = yield node.derivePath(`m/44'/195'/${nonce || 0}'`);
    const privateKeyBuf = child.privateKey;
    const privateKeyHex = privateKeyBuf === null || privateKeyBuf === void 0 ? void 0 : privateKeyBuf.toString("hex");
    const privateKey = String(privateKeyHex);
    const address = tronweb_1.default.address.fromPrivateKey(privateKey);
    return (0, interfaces_1.walletResponse)({
        mnemonic,
        privateKey,
        address,
    });
});
const importWalletFromTronPrivateKey = (mnemonic, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield bip39.mnemonicToSeed(mnemonic);
    const node = yield bip32.fromSeed(seed);
    const child = yield node.derivePath(`m/44'/195'/${nonce || 0}'`);
    const privateKeyBuf = child.privateKey;
    const privateKeyHex = privateKeyBuf === null || privateKeyBuf === void 0 ? void 0 : privateKeyBuf.toString("hex");
    const privateKey = String(privateKeyHex);
    const address = tronweb_1.default.address.fromPrivateKey(privateKey);
    return (0, interfaces_1.walletResponse)({
        mnemonic,
        privateKey,
        address,
    });
});
const getTronPrivateKeyAndWalletAddress = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const wallet_info = generateTronPrivateKey();
    const mnemonic = (_a = (yield wallet_info).mnemonic) !== null && _a !== void 0 ? _a : "";
    const nonce = (_b = (yield wallet_info).nonce) === null || _b === void 0 ? void 0 : _b.toString();
    return importWalletFromTronPrivateKey(mnemonic, nonce);
});
exports.getTronPrivateKeyAndWalletAddress = getTronPrivateKeyAndWalletAddress;
