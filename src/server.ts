import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import logger from "./utils/logger";
import routes from "./routes";
import db from "./app/db";

import middlewareLogger from "./app/middlewares/logger";
import middlewareErrorHandler from "./app/middlewares/errorHandler";

db.sync({ force: true })
  .then(() => logger.info("Sync database successfully"))
  .catch(logger.error);

const app = express();

app.use(middlewareLogger);
app.use(cors());
app.use(bodyParser.json());

app.use(routes);

app.use(middlewareErrorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`));
