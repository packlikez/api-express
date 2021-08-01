import express from "express";

import logger from "./utils/logger";
import routes from "./routes";
import db from "./app/db";

const app = express();

db.sync({ force: true }).then(logger.info).catch(logger.error);

app.use(routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`));
