const fs = require('fs');
const BaseStorage = require('./base-storage');
const settings = require('../config/settings');
const fileUtils = require('../utils/file-utils');

class JsonStorage extends BaseStorage {
  async connect() {
    fileUtils.ensureSecureDirectory();
  }

  async loadTasks() {
    if (fs.existsSync(settings.jsonFilePath)) {
      try {
        const content = fs.readFileSync(settings.jsonFilePath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('Erreur lors de la lecture des tâches:', error.message);
        return [];
      }
    }
    return [];
  }

  async saveTasks(tasks) {
    try {
      fileUtils.ensureSecureDirectory();
      fs.writeFileSync(settings.jsonFilePath, JSON.stringify(tasks, null, 2), { mode: 0o600 });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches:', error.message);
    }
  }
}

module.exports = JsonStorage;
