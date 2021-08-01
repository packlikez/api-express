import winston from "winston";

const {format,transports} = winston

const logFormat = format.combine(
    format.colorize(),
    format.simple()
)

const logger = winston.createLogger({
    level:'http',
    transports:[
        new transports.Console({ format:logFormat })
    ]
})

export default logger
