// -------------------- PACKAGE IMPORT FILES -------------------- //
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"

// --------------- Importing Main Route ---------------
import mainRoute from "./routes/main.route.js"

// --------------- Importing Other Files ---------------
import './services/cron.service.js';
import { corsOptions } from "./constants.js"
import Errorhandler from "./utilities/apiErrorHandler.js"

dotenv.config();
const app = express();

// --------------- Parsing Middlewares ---------------
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, withCredentials');
    next();
});

// ---------------------------------------
app.get("/", (request, response) => {
    response.status(200).send("API is working fine");
})

// --------------- Middlewares (Routes) ---------------
app.use("/", mainRoute);
// app.use("/api/v1/", mainRoute);

// --------------- Middlewares (Error Handler) ---------------
app.use(Errorhandler);

export { app };
