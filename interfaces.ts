interface IWalletResponse {
  address: string | unknown;
  privateKey: string;
  publicKey?: string;
  mnemonic?: string;
  nonce?: number;
  seed?: string;
}

export const walletResponse = (args: IWalletResponse) => {
  return args;
};
