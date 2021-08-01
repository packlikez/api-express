import express from "express";

import logger from "./utils/logger";
import routes from "./routes";

const app = express();

const PORT = process.env.PORT||4000
app.listen(PORT,()=>logger.info(`Listening on port: ${PORT}`))
