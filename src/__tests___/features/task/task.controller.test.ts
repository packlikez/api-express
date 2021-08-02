import taskController from "../../../features/task/task.controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import taskService from "../../../features/task/task.service";
import Boom from "@hapi/boom";

describe("Task Controller", () => {
  describe("GetTasks", () => {
    it("should complete", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();

      jest.spyOn(taskService, "getTasks").mockReturnThis();
      await taskController.getTasks(req, res, next);

      expect(res.send).toBeCalled();
    });

    it("should failed", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();

      const error = new Error();
      jest.spyOn(taskService, "getTasks").mockResolvedValue({ error });
      await taskController.getTasks(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("CreateTask", () => {
    it("should complete", async () => {
      const req = getMockReq({ body: { title: "Task 1" } });
      const { res, next } = getMockRes();

      jest.spyOn(taskService, "createTask").mockReturnThis();
      await taskController.createTask(req, res, next);

      expect(res.send).toBeCalled();
    });

    it("should failed, when taskService return error", async () => {
      const req = getMockReq({ body: { title: "Task 1" } });
      const { res, next } = getMockRes();

      const error = new Error();
      jest.spyOn(taskService, "createTask").mockResolvedValue({ error });
      await taskController.createTask(req, res, next);

      expect(next).toBeCalledWith(error);
    });

    it("should failed, when title is not string", async () => {
      const req = getMockReq({ body: { title: {} } });
      const { res, next } = getMockRes();

      const error = Boom.badRequest();
      await taskController.createTask(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("UpdateTask", () => {
    it("should complete", async () => {
      const req = getMockReq({ params: { taskId: 1 }, body: { done: true } });
      const { res, next } = getMockRes();

      jest.spyOn(taskService, "updateTask").mockReturnThis();
      await taskController.updateTask(req, res, next);

      expect(res.send).toBeCalled();
    });

    it("should failed, when taskService return error", async () => {
      const req = getMockReq({ params: { taskId: 1 }, body: { done: true } });
      const { res, next } = getMockRes();

      const error = new Error();
      jest.spyOn(taskService, "updateTask").mockResolvedValue({ error });
      await taskController.updateTask(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("CreateSubTask", () => {
    it("should complete", async () => {
      const req = getMockReq({
        params: { taskId: 1 },
        body: { title: "Task 1" },
      });
      const { res, next } = getMockRes();

      jest.spyOn(taskService, "createSubTask").mockReturnThis();
      await taskController.createSubTask(req, res, next);

      expect(res.send).toBeCalled();
    });

    it("should failed, when taskService return error", async () => {
      const req = getMockReq({
        params: { taskId: 1 },
        body: { title: "Task 1" },
      });
      const { res, next } = getMockRes();

      const error = new Error();
      jest.spyOn(taskService, "createSubTask").mockResolvedValue({ error });
      await taskController.createSubTask(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("UpdateSubTask", () => {
    it("should complete", async () => {
      const req = getMockReq({
        params: { taskId: 1, subTaskId: 2 },
        body: { done: true },
      });
      const { res, next } = getMockRes();

      jest.spyOn(taskService, "updateSubTask").mockReturnThis();
      await taskController.updateSubTask(req, res, next);

      expect(res.send).toBeCalled();
    });

    it("should failed, when taskService return error", async () => {
      const req = getMockReq({
        params: { taskId: 1, subTaskId: 2 },
        body: { done: true },
      });
      const { res, next } = getMockRes();

      const error = new Error();
      jest.spyOn(taskService, "updateSubTask").mockResolvedValue({ error });
      await taskController.updateSubTask(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });
});
