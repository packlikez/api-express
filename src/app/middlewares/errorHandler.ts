import { ErrorRequestHandler } from "express";

const middlewareErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  return res.send(500);
};

export default middlewareErrorHandler;
