import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import * as wallet from "../controllers/wallet.controller";
const router = Router();

router.post("/signup", auth.SignUp);
router.post("/depositconfirm", wallet.depositConfirm);

export default router;
