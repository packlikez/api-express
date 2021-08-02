import winston from "winston";

const { format, transports } = winston;

const logFormat = format.combine(format.colorize(), format.simple());

const logger = winston.createLogger({
  level: "debug",
  transports: [new transports.Console({ format: logFormat })],
});

if (process.env.NODE_ENV === "production") logger.level = "http";

export default logger;
