#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(process.env.HOME, '.tasks.json');

function loadTasks() {
  if (fs.existsSync(TASKS_FILE)) {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  }
  return [];
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
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
    console.log('Aucune tâche pour le moment!');
    return;
  }
  console.log('\n📋 Vos tâches:\n');
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
