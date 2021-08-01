import { Sequelize } from "sequelize";

import logger from "../utils/logger";

const db = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "5432"),
  logging: (msg) => logger.debug(msg),
});

export default db;
