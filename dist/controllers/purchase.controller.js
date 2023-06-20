"use strict";
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
exports.depositConfirm = void 0;
const tronweb_1 = __importDefault(require("tronweb"));
const config_1 = require("../config");
const depositConfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = req.body.PRIVATE_KEY;
    const tronWeb = new tronweb_1.default({
        fullHost: config_1.TRON_MAINNET_WEB3PROVIDER,
    });
    const contractAddress = config_1.USDT_TOKEN_ADDRESS_TRON;
    const decimals = 6;
    function getUSDTBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield tronWeb.getAccount(privateKey);
            const usdtBalanceHex = yield tronWeb
                .contract()
                .at(contractAddress)
                .balanceOf(account.address)
                .call();
            const usdtBalance = parseInt(usdtBalanceHex._hex) / Math.pow(10, decimals);
            console.log(`USDT balance: ${usdtBalance}`);
            res.json({ success: true, usdtBalance: usdtBalance });
        });
    }
    getUSDTBalance();
});
exports.depositConfirm = depositConfirm;
