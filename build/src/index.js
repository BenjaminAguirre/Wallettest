"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const autenticacion_1 = __importDefault(require("./routes/autenticacion"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.text({ type: "text/plain" })); //middleware que transforam req.body a un json
const PORT = 8000;
app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
});
app.use("/api", autenticacion_1.default);
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
