import { Request, Response } from "express";

import todoService from "./todo.service";

class TodoController {
  async getTasks(req: Request, res: Response) {
    const tasks = await todoService.getTasks();
    return res.send(tasks);
  }

  async createTask(req: Request, res: Response) {
    const task = req.body;
    const newTask = await todoService.createTask(task);
    return res.send(newTask);
  }

  async updateTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const task = req.body;
    const newTask = await todoService.updateTask(taskId, task);
    return res.send(newTask);
  }

  async createSubTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const task = req.body;
    const newSubTask = await todoService.createSubTask(taskId, task);
    return res.send(newSubTask);
  }

  async updateSubTask(req: Request, res: Response) {
    const { taskId, subTaskId } = req.params;
    const task = req.body;
    const newSubTask = await todoService.updateSubTask(taskId, subTaskId, task);
    return res.send(newSubTask);
  }
}

export default new TodoController();
