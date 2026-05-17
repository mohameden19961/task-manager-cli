const fs = require('fs');
const BaseStorage = require('./base-storage');
const settings = require('../config/settings');
const fileUtils = require('../utils/file-utils');

class SqliteStorage extends BaseStorage {
  constructor() {
    super();
    this.db = null;
  }

  async connect() {
    // 1. Ensure directory exists with 0o700
    fileUtils.ensureSecureDirectory();

    // 2. Open SQLite Database
    const Database = require('better-sqlite3');
    this.db = new Database(settings.sqliteFilePath);

    // 3. Restrict database file permissions to 0o600 (owner read/write only)
    if (fs.existsSync(settings.sqliteFilePath)) {
      try {
        fs.chmodSync(settings.sqliteFilePath, 0o600);
      } catch (err) {
        console.warn('⚠️ Impossible de restreindre les permissions du fichier SQLite:', err.message);
      }
    }

    // 4. Initialize Database Schema
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        priority TEXT DEFAULT 'medium',
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        dueDate TEXT,
        completedAt TEXT,
        recurrence TEXT,
        tags TEXT
      )
    `);
  }

  async loadTasks() {
    try {
      const stmt = this.db.prepare('SELECT * FROM tasks');
      const rows = stmt.all();

      return rows.map(row => ({
        id: Number(row.id),
        title: row.title,
        category: row.category,
        priority: row.priority,
        completed: Boolean(row.completed),
        createdAt: row.createdAt,
        dueDate: row.dueDate || null,
        completedAt: row.completedAt || null,
        recurrence: row.recurrence || null,
        tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des tâches depuis SQLite:', error.message);
      return [];
    }
  }

  async saveTasks(tasks) {
    // Execute inside a single transaction for maximum performance and atomicity
    const insertTransaction = this.db.transaction((tasksList) => {
      // Clear table
      this.db.prepare('DELETE FROM tasks').run();

      // Insert all
      const insertStmt = this.db.prepare(`
        INSERT INTO tasks (id, title, category, priority, completed, createdAt, dueDate, completedAt, recurrence, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const task of tasksList) {
        insertStmt.run(
          task.id,
          task.title,
          task.category,
          task.priority,
          task.completed ? 1 : 0,
          task.createdAt,
          task.dueDate || null,
          task.completedAt || null,
          task.recurrence || null,
          task.tags && task.tags.length > 0 ? task.tags.join(',') : null
        );
      }
    });

    try {
      insertTransaction(tasks);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches dans SQLite:', error.message);
    }
  }
}

module.exports = SqliteStorage;
