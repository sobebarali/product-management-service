import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./configs";
import connectDB from "./database";
import { errorLogger, errorResponder } from "./middlewares/error.middleware";
import limiter from "./services/rate-limiter";
import productRoutes from "./entry-point/api/product.route";

const app: Application = express();
const port = config.PORT;

const env = config.NODE_ENV;
const isDevelopment = !env || env === "development";
const prodCorsOrigin = config.PROD_CORS_ORIGIN;

if (process.env.NODE_ENV !== "test") {
  if (isDevelopment) {
    console.warn("Running in development mode - allowing CORS for all origins");
    app.use(cors());
  } else if (prodCorsOrigin) {
    console.log(
      `Running in production mode - allowing CORS for domain: ${prodCorsOrigin}`
    );
    const corsOptions = {
      origin: prodCorsOrigin, // Restrict to production domain
    };
    app.use(cors(corsOptions));
  } else {
    console.warn("Production CORS origin not set, defaulting to no CORS.");
  }
}

app.use(express.text());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(morgan("dev"));

//api routes
app.use("/api/products", productRoutes);

// Error handling middleware
app.use(errorLogger);
app.use(errorResponder);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).send({
    data: null,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource does not exist",
    },
  });
});



if (process.env.NODE_ENV === "test") {
   app.listen(port, () => {
     console.log(`[server]: Server is running at http://localhost:${port}`);
   });
} else {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  });
}

export default app;
