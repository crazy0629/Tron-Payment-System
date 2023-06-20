import { SERVER_PORT } from "./config";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes";

const app = express();

// Settings

app.set("port", SERVER_PORT);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes

app.use("/api", apiRoutes);

export default app;
