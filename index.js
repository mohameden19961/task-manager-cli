#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get current username
const username = process.env.USER || process.env.USERNAME || os.userInfo().username;

// Create .task-manager directory with restricted permissions
const TASK_DIR = path.join(process.env.HOME, '.task-manager');
if (!fs.existsSync(TASK_DIR)) {
  fs.mkdirSync(TASK_DIR, { mode: 0o700 }); // Only owner can read/write/execute
}

// Each user gets their own file
const TASKS_FILE = path.join(TASK_DIR, `${username}.json`);

function loadTasks() {
  if (fs.existsSync(TASKS_FILE)) {
    try {
      const content = fs.readFileSync(TASKS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur lors de la lecture des tâches:', error.message);
      return [];
    }
  }
  return [];
}

function saveTasks(tasks) {
  try {
    // Save with restricted permissions (only owner can read)
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), { mode: 0o600 });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tâches:', error.message);
  }
}

function addTask(title) {
  const tasks = loadTasks();
  const task = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`✓ Tâche ajoutée: "${title}"`);
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log(`Aucune tâche pour le moment! (Utilisateur: ${username})`);
    return;
  }
  console.log(`\n📋 Vos tâches (Utilisateur: ${username}):\n`);
  tasks.forEach((task, index) => {
    const status = task.completed ? '✓' : '○';
    console.log(`${index + 1}. [${status}] ${task.title}`);
  });
  console.log();
}

function completeTask(index) {
  const tasks = loadTasks();
  if (index < 0 || index >= tasks.length) {
    console.log('Index invalide');
    return;
  }
  tasks[index].completed = true;
  saveTasks(tasks);
  console.log(`✓ Tâche complétée: "${tasks[index].title}"`);
}

function deleteTask(index) {
  const tasks = loadTasks();
  if (index < 0 || index >= tasks.length) {
    console.log('Index invalide');
    return;
  }
  const deleted = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`✗ Tâche supprimée: "${deleted[0].title}"`);
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    if (args.length < 2) {
      console.log('Usage: task-manager add "description de la tâche"');
    } else {
      addTask(args.slice(1).join(' '));
    }
    break;
  case 'list':
    listTasks();
    break;
  case 'done':
    if (args.length < 2) {
      console.log('Usage: task-manager done <index>');
    } else {
      completeTask(parseInt(args[1]) - 1);
    }
    break;
  case 'delete':
    if (args.length < 2) {
      console.log('Usage: task-manager delete <index>');
    } else {
      deleteTask(parseInt(args[1]) - 1);
    }
    break;
  default:
    console.log('Task Manager CLI');
    console.log('');
    console.log('Commandes:');
    console.log('  add <title>     - Ajouter une nouvelle tâche');
    console.log('  list            - Lister toutes les tâches');
    console.log('  done <index>    - Marquer une tâche comme complétée');
    console.log('  delete <index>  - Supprimer une tâche');
}
