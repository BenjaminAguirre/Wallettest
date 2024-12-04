import express from "express";
import { createAccounts } from "../controllers/operatorController";


const router = express.Router()

router.post("/createAccounts", createAccounts)


export default router