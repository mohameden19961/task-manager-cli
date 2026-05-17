const path = require('path');
const os = require('os');
const fs = require('fs');

// Get current username
const username = process.env.USER || process.env.USERNAME || os.userInfo().username;

// Create .task-manager directory path
const TASK_DIR = path.join(process.env.HOME, '.task-manager');

// Load user configurations if existing
let userConfig = {};
const configPath = path.join(TASK_DIR, 'config.json');
if (fs.existsSync(configPath)) {
  try {
    userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (e) {
    // Silent ignore
  }
}

// Default configurations
const config = {
  username,
  taskDir: TASK_DIR,
  // Storage configurations: 'json' or 'sqlite'
  storageType: process.env.TASK_STORAGE_TYPE || userConfig.storageType || 'json',
  jsonFilePath: path.join(TASK_DIR, `${username}.json`),
  sqliteFilePath: path.join(TASK_DIR, `${username}.db`)
};

module.exports = config;
