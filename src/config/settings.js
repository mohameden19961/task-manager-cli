const path = require('path');
const os = require('os');

// Get current username
const username = process.env.USER || process.env.USERNAME || os.userInfo().username;

// Create .task-manager directory path
const TASK_DIR = path.join(process.env.HOME, '.task-manager');

// Default configurations
const config = {
  username,
  taskDir: TASK_DIR,
  // Storage configurations: 'json' or 'sqlite'
  storageType: process.env.TASK_STORAGE_TYPE || 'json',
  jsonFilePath: path.join(TASK_DIR, `${username}.json`),
  sqliteFilePath: path.join(TASK_DIR, `${username}.db`)
};

module.exports = config;
