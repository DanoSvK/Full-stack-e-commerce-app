import "dotenv/config";
import express from "express";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import compression from "compression";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.fatal(err, "UNCAUGHT EXCEPTION! Shutting down...");

  process.exit(1);
});

const app = express();

// Disable Express fingerprint, so potential attacker cannot tell the app is running Express
app.disable("x-powered-by");

// Set trust proxy
app.set("trust proxy", 1);

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Compress API responses
app.use(compression());

// HTTP request logging
// app.use(
//   pinoHttp({
//     logger,
//   }),
// );

// Enable CORS
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// // Limit requests from same API
// const limiter = expressRateLimit({
//   max: 100,
//   windowMs: 10 * 60 * 1000, // 1 hour
//   message: "Too many requests from this IP, please try again later!",
// });
// app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Prevent parameter pollution
app.use(hpp({ whitelist: ["price"] }));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Catches everything else that doesn't match any route
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.fatal(reason, "UNHANDLED REJECTION! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
