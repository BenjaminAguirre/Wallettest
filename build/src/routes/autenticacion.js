"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_controller_1 = require("../controllers/register.controller");
const register_controller_2 = require("../controllers/register.controller");
const router = express_1.default.Router();
router.post("/register", register_controller_1.generateWallet);
router.post("/login", register_controller_2.login);
exports.default = router;
