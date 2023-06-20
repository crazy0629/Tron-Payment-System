import TronWeb from "tronweb";
import * as bip39 from "bip39";
import * as bip32 from "bip32";

import { walletResponse } from "../interfaces";

const generateTronPrivateKey = async (nonce?: number) => {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = await bip32.fromSeed(seed);
  const child = await node.derivePath(`m/44'/195'/${nonce || 0}'`);
  const privateKeyBuf = child.privateKey;
  const privateKeyHex = privateKeyBuf?.toString("hex");
  const privateKey = String(privateKeyHex);
  const address = TronWeb.address.fromPrivateKey(privateKey);

  return walletResponse({
    mnemonic,
    privateKey,
    address,
  });
};

const importWalletFromTronPrivateKey = async (
  mnemonic: string,
  nonce?: string
) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = await bip32.fromSeed(seed);
  const child = await node.derivePath(`m/44'/195'/${nonce || 0}'`);
  const privateKeyBuf = child.privateKey;
  const privateKeyHex = privateKeyBuf?.toString("hex");
  const privateKey = String(privateKeyHex);
  const address = TronWeb.address.fromPrivateKey(privateKey);

  return walletResponse({
    mnemonic,
    privateKey,
    address,
  });
};

export const getTronPrivateKeyAndWalletAddress = async () => {
  const wallet_info = generateTronPrivateKey();
  const mnemonic = (await wallet_info).mnemonic ?? "";
  const nonce = (await wallet_info).nonce?.toString();

  return importWalletFromTronPrivateKey(mnemonic, nonce);
};
