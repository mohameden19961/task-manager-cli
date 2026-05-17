const settings = require('../config/settings');
const JsonStorage = require('./json-storage');

class StorageFactory {
  static getStorage() {
    switch (settings.storageType) {
      case 'sqlite':
        // SQLite Storage can be loaded dynamically in next phases
        try {
          const SqliteStorage = require('./sqlite-storage');
          return new SqliteStorage();
        } catch (e) {
          console.warn('⚠️ SQLite storage is selected but could not be loaded. Falling back to JSON.', e.message);
          return new JsonStorage();
        }
      case 'json':
      default:
        return new JsonStorage();
    }
  }
}

module.exports = StorageFactory;
