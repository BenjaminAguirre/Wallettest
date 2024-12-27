import express from "express";
import { fluxTest, FluxId, ChildKeypair, XprivXpub, akashAccount} from "../controllers/flux/flux.controller";


const router = express.Router()

router.post("/createFlux", fluxTest);
router.post("/createFluxId", FluxId);
// router.post("/getZelId", auth);
router.post("/child", ChildKeypair);
router.post("/Master", XprivXpub);
router.post("/Akash", akashAccount);




export default router