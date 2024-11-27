import express from "express";
import { createWallet } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createWallet", createWallet)


export default router