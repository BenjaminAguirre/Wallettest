import express from "express";
import bodyParser from "body-parser";
import registerRouter from "./routes/akashRoutes"

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));//middleware que transforam req.body a un json

const PORT = 8000;

app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong")
})

app.use("/api", registerRouter);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});