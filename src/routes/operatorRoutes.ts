import express from "express";
import { fluxTest, FluxId, ChildKeypair, XprivXpub, akashAccount, createGridAccount} from "../controllers/operatorController";


const router = express.Router()

router.post("/createFlux", fluxTest);
router.post("/gridAccount", createGridAccount);
router.post("/createFluxId", FluxId);
// router.post("/getZelId", auth);
router.post("/child", ChildKeypair);
router.post("/Master", XprivXpub);
router.post("/Akash", akashAccount);




export default router