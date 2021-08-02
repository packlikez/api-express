import taskModel from "./task.model";
import db from "../../app/db";

type TaskId = number;

interface CreateTask {
  title: string;
}

interface UpdateTask {
  done: boolean;
}

class TaskService {
  async getTasks() {
    return taskModel.findAll({
      where: { parentId: null },
      include: [{ model: taskModel, as: "subTasks" }],
    });
  }

  async createTask(task: CreateTask) {
    return taskModel.create(task);
  }

  async updateTask(taskId: TaskId, task: UpdateTask) {
    let transaction;
    try {
      transaction = await db.transaction();

      if (task.done) {
        await taskModel.update(
          { done: true },
          { where: { parentId: taskId }, transaction }
        );
      }

      const result = await taskModel.update(task, {
        where: { id: taskId },
        transaction,
      });

      await transaction.commit();
      return result;
    } catch (e) {
      if (transaction) await transaction.rollback();
      return { err: e };
    }
  }

  async createSubTask(taskId: TaskId, task: CreateTask) {
    try {
      return taskModel.create({ ...task, parentId: taskId });
    } catch (e) {
      return { err: e };
    }
  }

  async updateSubTask(taskId: TaskId, subTaskId: TaskId, task: UpdateTask) {
    let transaction;
    try {
      transaction = await db.transaction();

      if (!task.done) {
        await taskModel.update(
          { done: false },
          { where: { id: taskId }, transaction }
        );
      }

      const result = await taskModel.update(task, {
        where: { id: subTaskId },
        transaction,
      });

      await transaction.commit();
      return result;
    } catch (e) {
      if (transaction) await transaction.rollback();
      return { err: e };
    }
  }
}

export default new TaskService();
