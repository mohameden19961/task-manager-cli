class BaseStorage {
  async connect() {
    throw new Error('connect() not implemented');
  }

  async loadTasks() {
    throw new Error('loadTasks() not implemented');
  }

  async saveTasks(tasks) {
    throw new Error('saveTasks() not implemented');
  }
}

module.exports = BaseStorage;
