import taskModel from "../../../features/task/task.model";
import taskService from "../../../features/task/task.service";
import db from "../../../app/db";
import { mockTx } from "../../mocks/transaction";
import Boom from "@hapi/boom";

describe("Task Service", () => {
  describe("GetTask", () => {
    it("should successfully get task, when there is no task", async () => {
      const task = null;
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(task);

      const result = await taskService.getTask(1);
      expect(result).toEqual({ error: Boom.notFound(`There is no task ID 1`) });
    });

    it("should successfully get task, when there is a task", async () => {
      const task = taskModel.build({ title: "Task 1", done: false });
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(task);

      const result = await taskService.getTask(1);
      expect(result).toEqual({ data: task });
    });

    it("should failed to get task, when orm throw a error", async () => {
      const error = new Error();
      jest.spyOn(taskModel, "findByPk").mockRejectedValue(error);

      const result = await taskService.getTask(1);

      expect(result).toEqual({ error });
    });
  });

  describe("GetTasks", () => {
    it("should successfully get tasks, when there is no task", async () => {
      jest.spyOn(taskModel, "findAll").mockResolvedValue([]);

      const result = await taskService.getTasks();

      expect(result).toEqual({ data: [] });
    });

    it("should successfully get tasks, when there are tasks", async () => {
      const tasks = taskModel.bulkBuild([
        { title: "Task1", done: false },
        { title: "Task2", done: true },
      ]);
      jest.spyOn(taskModel, "findAll").mockResolvedValue(tasks);

      const result = await taskService.getTasks();

      expect(result).toEqual({ data: tasks });
    });

    it("should failed to get tasks, when orm throw a error", async () => {
      const error = new Error();
      jest.spyOn(taskModel, "findAll").mockRejectedValue(error);

      const result = await taskService.getTasks();

      expect(result).toEqual({ error });
    });
  });

  describe("CreateTask", () => {
    it("should successfully create a task", async () => {
      const task = taskModel.build({ title: "Task 1", done: false });
      jest.spyOn(taskModel, "create").mockResolvedValue(task);
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(task);

      const result = await taskService.createTask({ title: "Task 1" });
      expect(result).toEqual({ data: task });
    });

    it("should failed to create a task", async () => {
      const error = new Error();
      jest.spyOn(taskModel, "create").mockRejectedValue(error);

      const result = await taskService.createTask({ title: "Task 1" });

      expect(result).toEqual({ error });
    });
  });

  describe("UpdateTask", () => {
    it("should successfully update task, when set done to true", async () => {
      const taskId = 1;
      const updateTask = { done: true };
      const updatedTask = taskModel.build({ title: "Task 1", done: true });

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(updatedTask);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([1, [updatedTask]]);

      const result = await taskService.updateTask(taskId, updateTask);
      expect(taskUpdate).toBeCalledTimes(2);
      expect(mockTx.commit).toBeCalled();
      expect(result).toEqual({ data: updatedTask });
    });

    it("should successfully update task, when set done to false", async () => {
      const taskId = 1;
      const updateTask = { done: false };
      const updatedTask = taskModel.build({ title: "Task 1", done: true });

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(updatedTask);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([1, [updatedTask]]);

      const result = await taskService.updateTask(taskId, updateTask);

      expect(taskUpdate).toBeCalledTimes(1);
      expect(mockTx.commit).toBeCalled();
      expect(result).toEqual({ data: updatedTask });
    });

    it("should failed to update task, when update no record", async () => {
      const taskId = 1;
      const updateTask = { done: false };

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([0, []]);

      const result = await taskService.updateTask(taskId, updateTask);

      expect(taskUpdate).toBeCalledTimes(1);
      expect(mockTx.rollback).toBeCalled();
      expect(result).toEqual({
        error: Boom.resourceGone(`There is no task ID ${taskId}`),
      });
    });

    it("should failed to update task, when can't start transaction", async () => {
      const taskId = 1;
      const updateTask = { done: false };

      const error = new Error();
      jest.spyOn(db, "transaction").mockRejectedValue(error);

      const result = await taskService.updateTask(taskId, updateTask);

      expect(result).toEqual({ error });
    });
  });

  describe("CreateSubTask", () => {
    it("should successfully create a sub task", async () => {
      const taskId = 1;
      const task = taskModel.build({ title: "Task 1", done: false });
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(task);
      jest.spyOn(taskModel, "create").mockResolvedValue(task);

      const result = await taskService.createSubTask(taskId, {
        title: "Task 1",
      });

      expect(result).toEqual({ data: task });
    });

    it("should failed to create a sub task, when there is not parent task", async () => {
      const taskId = 1;
      jest.spyOn(taskModel, "findByPk").mockResolvedValue(null);

      const result = await taskService.createSubTask(taskId, {
        title: "Task 1",
      });

      expect(result).toEqual({
        error: Boom.notFound(`There is not task ID ${taskId}`),
      });
    });
  });

  describe("UpdateSubTask", () => {
    it("should successfully update sub task, when set done to true", async () => {
      const taskId = 1;
      const subTaskId = 2;
      const updateTask = { done: true };
      const updatedTask = taskModel.build({ title: "Task 1", done: true });

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([1, [updatedTask]]);

      const result = await taskService.updateSubTask(
        taskId,
        subTaskId,
        updateTask
      );

      expect(taskUpdate).toBeCalledTimes(1);
      expect(mockTx.commit).toBeCalled();
      expect(result).toEqual({ data: updatedTask });
    });

    it("should successfully update sub task, when set done to false", async () => {
      const taskId = 1;
      const subTaskId = 2;
      const updateTask = { done: false };
      const updatedTask = taskModel.build({ title: "Task 1", done: true });

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([1, [updatedTask]]);

      const result = await taskService.updateSubTask(
        taskId,
        subTaskId,
        updateTask
      );

      expect(taskUpdate).toBeCalledTimes(2);
      expect(mockTx.commit).toBeCalled();
      expect(result).toEqual({ data: updatedTask });
    });

    it("should failed to update sub task, when update no record of subtask", async () => {
      const taskId = 1;
      const subTaskId = 2;
      const updateTask = { done: false };

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValueOnce([1, []])
        .mockResolvedValue([0, []]);

      const result = await taskService.updateSubTask(
        taskId,
        subTaskId,
        updateTask
      );

      expect(taskUpdate).toBeCalledTimes(2);
      expect(mockTx.rollback).toBeCalled();
      expect(result).toEqual({
        error: Boom.resourceGone(
          `There is no sub task ID ${subTaskId} which is under task ID ${taskId}`
        ),
      });
    });

    it("should failed to update sub task, when update no record of parent task", async () => {
      const taskId = 1;
      const subTaskId = 2;
      const updateTask = { done: false };

      jest.spyOn(db, "transaction").mockResolvedValue(mockTx.tx);
      const taskUpdate = jest
        .spyOn(taskModel, "update")
        .mockResolvedValue([0, []]);

      const result = await taskService.updateSubTask(
        taskId,
        subTaskId,
        updateTask
      );

      expect(taskUpdate).toBeCalledTimes(1);
      expect(mockTx.rollback).toBeCalled();
      expect(result).toEqual({
        error: Boom.resourceGone(`There is no task ID ${taskId}`),
      });
    });

    it("should failed to update sub task, when can't start transaction", async () => {
      const taskId = 1;
      const subTaskId = 2;
      const updateTask = { done: false };

      const error = new Error();
      jest.spyOn(db, "transaction").mockRejectedValue(error);

      const result = await taskService.updateSubTask(
        taskId,
        subTaskId,
        updateTask
      );

      expect(result).toEqual({ error });
    });
  });
});
