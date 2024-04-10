import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

import path from 'path';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);``
    // .then(() => console.log(
    //     "Connected to MongoDB", 
    //     process.env.MONGODB_CONNECTION_STRING));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
})); // Security for the API to be accessed from any domain

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes); // All routes in the authRoutes will be prefixed with /api/auth
app.use("/api/users", userRoutes); // All routes in the userRoutes will be prefixed with /api/users



app.get("*", async (req: Request, res: Response) => {
    res.json({ message: "wrong route" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

