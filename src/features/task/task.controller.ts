import { Request, Response, NextFunction } from "express";

import taskService from "./task.service";

class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getTasks();
      return res.send(tasks);
    } catch (e) {
      return next(e);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = req.body;

      const newTask = await taskService.createTask(task);

      return res.send(newTask);
    } catch (e) {
      return next(e);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = req.body;

      const newTask = await taskService.updateTask(parseInt(taskId), task);

      return res.send(newTask);
    } catch (e) {
      return next(e);
    }
  }

  async createSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = req.body;

      const newSubTask = await taskService.createSubTask(
        parseInt(taskId),
        task
      );

      return res.send(newSubTask);
    } catch (e) {
      return next(e);
    }
  }

  async updateSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, subTaskId } = req.params;
      const task = req.body;

      const newSubTask = await taskService.updateSubTask(
        parseInt(taskId),
        parseInt(subTaskId),
        task
      );

      return res.send(newSubTask);
    } catch (e) {
      return next(e);
    }
  }
}

export default new TaskController();
