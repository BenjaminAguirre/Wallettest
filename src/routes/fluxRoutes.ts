import express from "express";
import { fluxTest, FluxId } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createFlux", fluxTest)
router.post("/createFluxId", FluxId)




export default router