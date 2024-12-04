import express from "express";
import { createPrivKey } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createFlux", createPrivKey)


export default router