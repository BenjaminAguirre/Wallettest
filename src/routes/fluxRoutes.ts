import express from "express";
import { createPrivKey, LogIn } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createFlux", createPrivKey)
router.post("/valiteFlux", LogIn)



export default router