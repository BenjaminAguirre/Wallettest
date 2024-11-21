import express from "express";
import { 
  generateDirectWallet,
  generateWallet,
  validateWallet 
} from "../controllers/akash/register.controller";

const router = express.Router();

router.get("/registerdirect", generateDirectWallet);
router.get("/register", generateWallet);
router.post("/validate", validateWallet);

export default router;