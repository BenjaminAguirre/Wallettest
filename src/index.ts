import express from "express";
import bodyParser from "body-parser";
import operatorRouter from "./routes/operatorRoutes";
// import operatorRouter from "./routes/operatorRouter"
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));//middleware que transforam req.body a un json

const PORT = 8000;


app.use("/api", operatorRouter);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});