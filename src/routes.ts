import express from "express";
import todoRouter from "./features/todo/todo.route";

const router = express.Router();

router.use("/todos", todoRouter);

export default router;
