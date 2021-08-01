import express from "express";

import todoController from "./todo.controller";

const todoRouter = express.Router();

todoRouter.get("/", todoController.getTasks);
todoRouter.post("/", todoController.createTask);
todoRouter.patch("/:taskId", todoController.updateTask);
todoRouter.post("/:taskId/subTasks", todoController.createSubTask);
todoRouter.patch("/:taskId/subTasks/:subTaskId", todoController.updateSubTask);

export default todoRouter;
