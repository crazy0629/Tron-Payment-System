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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const tron_1 = require("../service/tron");
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tron = (0, tron_1.getTronPrivateKeyAndWalletAddress)();
    const walletInfo = {
        privateKey: (yield tron).privateKey,
        address: (yield tron).address,
    };
    res.json({ success: true, walletInfo: walletInfo });
});
exports.SignUp = SignUp;
