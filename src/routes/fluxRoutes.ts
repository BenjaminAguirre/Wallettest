import express from "express";
import { createPrivKey } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createWallet", createPrivKey)


export default router