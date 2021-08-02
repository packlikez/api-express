import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import taskService from "./task.service";
import validator from "../../utils/validator";

const createTaskSchema = Joi.object({ title: Joi.string().trim().required() });

const updateTaskSchema = Joi.object({ done: Joi.boolean().required() });

const taskIdSchema = Joi.number().required();

class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getTasks();
      if (tasks.error) throw tasks.error;

      return res.send({ data: tasks.data });
    } catch (e) {
      return next(e);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = validator(createTaskSchema, req.body);

      const newTask = await taskService.createTask(task);
      if (newTask.error) throw newTask.error;

      return res.send({ data: newTask.data });
    } catch (e) {
      return next(e);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const task = validator(updateTaskSchema, req.body);

      const updatedTask = await taskService.updateTask(taskId, task);
      if (updatedTask.error) throw updatedTask.error;

      return res.send({ data: updatedTask.data });
    } catch (e) {
      return next(e);
    }
  }

  async createSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const task = validator(createTaskSchema, req.body);

      const newSubTask = await taskService.createSubTask(taskId, task);
      if (newSubTask.error) throw newSubTask.error;

      return res.send({ data: newSubTask.data });
    } catch (e) {
      return next(e);
    }
  }

  async updateSubTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = validator(taskIdSchema, req.params.taskId);
      const subTaskId = validator(taskIdSchema, req.params.subTaskId);
      const task = validator(updateTaskSchema, req.body);

      const updatedSubTask = await taskService.updateSubTask(
        taskId,
        subTaskId,
        task
      );
      if (updatedSubTask.error) throw updatedSubTask.error;

      return res.send({ data: updatedSubTask.data });
    } catch (e) {
      return next(e);
    }
  }
}

export default new TaskController();
