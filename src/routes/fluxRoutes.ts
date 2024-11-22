import express from "express";
import { getLibIdController } from "../controllers/flux/flux.controller"

const router = express.Router()


router.get("/lib", getLibIdController)

export default router