import config from "config";
import validateEnv from "./utils/validateEnv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import routes from "./api/routes";
import redisClient from "./utils/connectRedis";
import { AppDataSource } from "./utils/data-source";
import { PORT } from "./utils/config";

const app: Express = express();

export const loggerNamespace = "logger_namespace";

// function clsRequestId(namespace, generateId) {
//   return (req, res, next) => {
//     const reqId = req.get("X-Request-Id") || generateId();

//     res.set("X-RequestId", reqId);

//     namespace.run(() => {
//       namespace.set("requestId", reqId);
//       next();
//     });
//   };
// }

const port: string | number = PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

routes(app)

const checkRedisHealth = async (_: Request, res: Response): Promise<any> => {
  const message = await redisClient.get("try");
  return res.status(200).json({
    status: "success",
    message,
  });
};

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    // const app = express();

    // MIDDLEWARE

    // 1. Body parser

    // 2. Logger

    // 3. Cookie Parser

    // 4. Cors

    // ROUTES

    // HEALTH CHECKER
    app.get("/api/healthchecker", checkRedisHealth);

    // UNHANDLED ROUTE

    // GLOBAL ERROR HANDLER

    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });

    
  })
  .catch((error: any) => console.log(error));
