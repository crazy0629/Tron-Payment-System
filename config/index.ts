import dotenv from "dotenv";

dotenv.config();

export const SERVER_PORT = (process.env.SERVER_PORT as string) || 8000;

export const TRON_MAINNET_WEB3PROVIDER = "https://api.trongrid.io";
export const TRON_TESTNET_WEB3PROVIDER = "https://api.shasta.trongrid.io";

export const USDT_TOKEN_ADDRESS_TRON: string =
  process.env.USDT_TOKEN_ADDRESS_TRON || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

export const USDT_TOKEN_ADDRESS_TRON_TESTNET: string =
  process.env.USDT_TOKEN_ADDRESS_TRON_TESTNET ||
  "TNUC9Qb1rRpS5CbWLuyY1q8yfSc1DBogQW";

export const FULL_NODE: string =
  process.env.FULL_NODE || "https://api.trongrid.io";

export const SOLIDITY_NODE: string =
  process.env.SOLIDITY_NODE || "https://api.trongrid.io";

export const EVENT_SERVER: string =
  process.env.EVENT_SERVER || "https://api.trongrid.io";

export const usdt_contract_address: string =
  process.env.USDT_TOKEN_ADDRESS_TRON ||
  "41A614F803B6FD780986A42C78EC9C7F77E6DED1";

export const TRON_API_KEY: string =
  process.env.TRON_API_KEY || "d42e51d0-1bfa-4ff6-9ea6-d34c18a3359d";

export const MUL: string =
  process.env.MUL || "https://tron-calc-fee.vercel.app/api/setData";
