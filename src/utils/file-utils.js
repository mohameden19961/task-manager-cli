const fs = require('fs');
const settings = require('../config/settings');

function ensureSecureDirectory() {
  if (!fs.existsSync(settings.taskDir)) {
    fs.mkdirSync(settings.taskDir, { mode: 0o700 });
  }
}

module.exports = {
  ensureSecureDirectory
};
