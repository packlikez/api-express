import expressWinston from "express-winston";
import logger from "../../utils/logger";

const middlewareLogger = expressWinston.logger({
  level: "http",
  winstonInstance: logger,
});

export default middlewareLogger;
