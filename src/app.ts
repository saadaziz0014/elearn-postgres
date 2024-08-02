import express from "express";
import index from "./routes/index";
const app = express();


app.use(express.json());
app.use("/", index);
app.listen(3000, () => console.log("Server running on port 3000"));