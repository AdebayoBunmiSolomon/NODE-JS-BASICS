import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import routers from "./routers";

const app = express();

const allowedOrigins = ["http://frontend.com", "http://anotherfrontend.com"];

const corsOptions: object = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Check if the origin is in the allowed list or if origin is undefined (e.g., for server-to-server calls)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials like cookies
};

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const SERVER = http.createServer(app);
const PORT = 8080;

const MONGO_URL =
  "mongodb+srv://adebayobunmisolomon:adebayobunmisolomon@cluster0.ocola.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

SERVER.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connection to MONGO_DB established");
  })
  .catch((err: Error) => {
    console.log("Mongoose error in connection", err);
  });

// Event listeners for ongoing connection status
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database");
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Error in Mongoose connection:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from the database");
});

app.use("/", routers());
