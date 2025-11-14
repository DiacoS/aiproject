import express from "express";
import cors from "cors";
import applicationsRouter from "./api/applications.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", applicationsRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kører på http://localhost:${PORT}`));
