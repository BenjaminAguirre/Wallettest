import express from "express";
import { fluxTest, FluxId, auth } from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createFlux", fluxTest);
router.post("/createFluxId", FluxId);
router.post("/getZelId", auth);




export default router