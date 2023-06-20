import { Request, Response } from "express";
import { getTronPrivateKeyAndWalletAddress } from "../service/tron";

export const SignUp = async (req: Request, res: Response) => {
  const tron = getTronPrivateKeyAndWalletAddress();
  const walletInfo = {
    privateKey: (await tron).privateKey,
    address: (await tron).address,
  };
  res.json({ success: true, walletInfo: walletInfo });
};
