import express from "express";
import bodyParser from "body-parser";
import registerRouter from "./routes/akashRoutes"
import fluxRouter from "./routes/fluxRoutes";
// import operatorRouter from "./routes/operatorRouter"
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));//middleware que transforam req.body a un json

const PORT = 8000;

app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong")
})

app.use("/api", registerRouter);
app.use("/api", fluxRouter);
// app.use("/api", operatorRouter);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});