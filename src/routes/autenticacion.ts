import express from "express";
import { generateWallet } from "../controllers/register.controller";
import { getData} from "../controllers/register.controller";

const router = express.Router();

router.get("/register", generateWallet);
router.get("/data", getData);




export default router