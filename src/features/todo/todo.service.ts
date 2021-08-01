class TodoService {
  async getTasks() {}
  async createTask(task) {}
  async updateTask(taskId, task) {}
  async createSubTask(taskId, task) {}
  async updateSubTask(taskId, subTaskId, task) {}
}

export default new TodoService();
