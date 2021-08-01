import logger from "../../utils/logger";

class TodoController {
  getTasks() {
    logger.info("getTasks");
  }
  createTask() {
    logger.info("createTask");
  }
  updateTask() {
    logger.info("updateTask");
  }
  createSubTask() {
    logger.info("createSubTask");
  }
  updateSubTask() {
    logger.info("updateSubTask");
  }
}

export default new TodoController();
