import { ErrorRequestHandler } from "express";
import Boom from "@hapi/boom";
import logger from "../../utils/logger";

const middlewareErrorHandler: ErrorRequestHandler = (
  err: Boom.Boom,
  req,
  res,
  next
) => {
  logger.error(err);

  if (err.isBoom) {
    const { output, data } = err;
    return res.status(output.statusCode).send({
      statusCode: output.statusCode,
      message: output.payload.message,
      data,
    });
  }

  return res.status(500).send({ message: Boom.internal().message });
};

export default middlewareErrorHandler;
