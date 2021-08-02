import express from "express";
import taskRouter from "./features/task/task.route";

const router = express.Router();

router.use("/tasks", taskRouter);

export default router;
