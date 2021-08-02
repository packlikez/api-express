import { Request, Response, NextFunction } from "express";

import taskService from "./task.service";
import Joi from "joi";
import validator from "../../utils/validator";

const createTaskSchema = Joi.object({ title: Joi.string().trim().required() });

const updateTaskSchema = Joi.object({ done: Joi.boolean().required() });

const taskIdSchema = Joi.number().required();

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
      const task = validator(createTaskSchema, req.body);

      const newTask = await taskService.createTask(task);

      return res.send(newTask);
    } catch (e) {
      return next(e);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const task = validator(updateTaskSchema, req.body);

      const newTask = await taskService.updateTask(taskId, task);

      return res.send(newTask);
    } catch (e) {
      return next(e);
    }
  }

  async createSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const task = validator(createTaskSchema, req.body);

      const newSubTask = await taskService.createSubTask(taskId, task);

      return res.send(newSubTask);
    } catch (e) {
      return next(e);
    }
  }

  async updateSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const subTaskId = validator(taskIdSchema, req.params.subTaskId);
      const task = validator(updateTaskSchema, req.body);

      const newSubTask = await taskService.updateSubTask(
        taskId,
        subTaskId,
        task
      );

      return res.send(newSubTask);
    } catch (e) {
      return next(e);
    }
  }
}

export default new TaskController();
