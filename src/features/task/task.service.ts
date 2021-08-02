import Boom from "@hapi/boom";

import taskModel from "./task.model";
import db from "../../app/db";
import { ServiceResponse } from "../../app/type";

type TaskId = number;

interface CreateTask {
  title: string;
}

interface UpdateTask {
  done: boolean;
}

class TaskService {
  async getTasks(): ServiceResponse {
    try {
      const data = await taskModel.findAll({
        where: { parentId: null },
        include: [{ model: taskModel, as: "subTasks" }],
      });
      return { data };
    } catch (e) {
      return { error: e };
    }
  }

  async createTask(task: CreateTask): ServiceResponse {
    try {
      const data = await taskModel.create(task);
      return { data };
    } catch (e) {
      return { error: e };
    }
  }

  async updateTask(taskId: TaskId, task: UpdateTask): ServiceResponse {
    let transaction;
    try {
      transaction = await db.transaction();

      if (task.done) {
        await taskModel.update(
          { done: true },
          { where: { parentId: taskId }, transaction }
        );
      }

      const data = await taskModel.update(task, {
        where: { id: taskId },
        transaction,
        returning: true,
      });
      if (data[0] < 1) throw Boom.resourceGone(`There is no task ID ${taskId}`);

      await transaction.commit();
      return { data: data[1][0] };
    } catch (e) {
      if (transaction) await transaction.rollback();
      return { error: e };
    }
  }

  async createSubTask(taskId: TaskId, task: CreateTask): ServiceResponse {
    try {
      const findParent = await taskModel.findByPk(taskId);
      if (!findParent) throw Boom.notFound(`There is not task ID ${taskId}`);

      const data = await taskModel.create({ ...task, parentId: taskId });
      return { data };
    } catch (e) {
      return { error: e };
    }
  }

  async updateSubTask(
    taskId: TaskId,
    subTaskId: TaskId,
    task: UpdateTask
  ): ServiceResponse {
    let transaction;
    try {
      transaction = await db.transaction();

      if (!task.done) {
        const updatedParent = await taskModel.update(
          { done: false },
          { where: { id: taskId }, transaction }
        );
        if (updatedParent[0] < 1)
          throw Boom.resourceGone(`There is no task ID ${taskId}`);
      }

      const data = await taskModel.update(task, {
        where: { id: subTaskId, parentId: taskId },
        transaction,
        returning: true,
      });
      if (data[0] < 1)
        throw Boom.resourceGone(
          `There is no sub task ID ${subTaskId} which is under task ID ${taskId}`
        );

      await transaction.commit();
      return { data: data[1][0] };
    } catch (e) {
      if (transaction) await transaction.rollback();
      return { error: e };
    }
  }
}

export default new TaskService();
