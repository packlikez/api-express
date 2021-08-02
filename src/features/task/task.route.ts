import express from "express";

import taskController from "./task.controller";

const taskRouter = express.Router();

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/", taskController.createTask);
taskRouter.patch("/:taskId", taskController.updateTask);
taskRouter.post("/:taskId/subTasks", taskController.createSubTask);
taskRouter.patch("/:taskId/subTasks/:subTaskId", taskController.updateSubTask);

export default taskRouter;
