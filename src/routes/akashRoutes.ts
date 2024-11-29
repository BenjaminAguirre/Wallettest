import express from "express";
import { 
  generateWallet,
} from "../controllers/akash/akash.controller";

const router = express.Router();

router.post("/createWallet", generateWallet);


export default router;