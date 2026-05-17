#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get current username
const username = process.env.USER || process.env.USERNAME || os.userInfo().username;

// Create .task-manager directory with restricted permissions
const TASK_DIR = path.join(process.env.HOME, '.task-manager');
if (!fs.existsSync(TASK_DIR)) {
  fs.mkdirSync(TASK_DIR, { mode: 0o700 });
}

// Each user gets their own file
const TASKS_FILE = path.join(TASK_DIR, `${username}.json`);

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

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
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), { mode: 0o600 });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tâches:', error.message);
  }
}

function parseArgs(args) {
  const options = {
    title: '',
    category: 'General',
    dueDate: null,
    priority: 'medium'
  };

  let i = 0;
  while (i < args.length) {
    if (args[i] === '--category' || args[i] === '-c') {
      options.category = args[i + 1];
      i += 2;
    } else if (args[i] === '--due' || args[i] === '-d') {
      options.dueDate = args[i + 1];
      i += 2;
    } else if (args[i] === '--priority' || args[i] === '-p') {
      options.priority = args[i + 1];
      i += 2;
    } else {
      options.title += (options.title ? ' ' : '') + args[i];
      i++;
    }
  }

  return options;
}

function isDateOverdue(dueDate) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  return due < new Date() && !isToday(dueDate);
}

function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isSoon(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 7);
  return date >= today && date <= tomorrow && !isToday(dateStr);
}

function formatDate(dateStr) {
  if (!dateStr) return 'Pas de date';
  const date = new Date(dateStr);
  const today = new Date();
  const diff = date - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (isToday(dateStr)) return `${colors.yellow}Aujourd'hui${colors.reset}`;
  if (days === 1) return `${colors.yellow}Demain${colors.reset}`;
  if (days < 0) return `${colors.red}En retard de ${Math.abs(days)} jours${colors.reset}`;
  if (days <= 7) return `${colors.cyan}Dans ${days} jours${colors.reset}`;
  
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getCategoryIcon(category) {
  const icons = {
    'Work': '💼',
    'Personal': '👤',
    'Shopping': '🛒',
    'Learning': '📚',
    'Health': '🏥',
    'Home': '🏠',
    'General': '✓'
  };
  return icons[category] || '✓';
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return colors.red;
    case 'medium': return colors.yellow;
    case 'low': return colors.green;
    default: return colors.reset;
  }
}

function addTask(args) {
  const options = parseArgs(args);
  
  if (!options.title.trim()) {
    console.log('❌ Erreur: Le titre de la tâche est requis');
    return;
  }

  const tasks = loadTasks();
  const task = {
    id: Date.now(),
    title: options.title.trim(),
    category: options.category,
    priority: options.priority,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: options.dueDate || null
  };

  tasks.push(task);
  saveTasks(tasks);
  
  console.log(`${colors.green}✓${colors.reset} Tâche ajoutée: "${options.title.trim()}"`);
  if (options.dueDate) console.log(`  Échéance: ${formatDate(options.dueDate)}`);
  if (options.category !== 'General') console.log(`  Catégorie: ${options.category}`);
  if (options.priority !== 'medium') console.log(`  Priorité: ${options.priority}`);
}

function listTasks(filterCategory = null) {
  const tasks = loadTasks();
  
  if (tasks.length === 0) {
    console.log(`${colors.gray}Aucune tâche pour le moment! (Utilisateur: ${username})${colors.reset}\n`);
    return;
  }

  // Group by category
  const grouped = {};
  tasks.forEach(task => {
    if (filterCategory && task.category !== filterCategory) return;
    if (!grouped[task.category]) {
      grouped[task.category] = [];
    }
    grouped[task.category].push(task);
  });

  console.log(`\n${colors.blue}📋 Vos tâches (Utilisateur: ${username})${colors.reset}\n`);

  Object.keys(grouped).sort().forEach(category => {
    console.log(`${getCategoryIcon(category)} ${colors.blue}${category}${colors.reset}`);
    
    grouped[category].forEach((task, index) => {
      const priorityColor = getPriorityColor(task.priority);
      const status = task.completed ? `${colors.green}✓${colors.reset}` : '○';
      const priorityStr = task.priority === 'medium' ? '' : ` [${priorityColor}${task.priority}${colors.reset}]`;
      const dueDateStr = task.dueDate ? ` | ${formatDate(task.dueDate)}` : '';
      
      console.log(`  ${task.id} [${status}] ${task.title}${priorityStr}${dueDateStr}`);
    });
    console.log();
  });
}

function completeTask(taskId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    console.log('❌ Tâche non trouvée');
    return;
  }

  task.completed = true;
  task.completedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`${colors.green}✓${colors.reset} Tâche complétée: "${task.title}"`);
}

function deleteTask(taskId) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index === -1) {
    console.log('❌ Tâche non trouvée');
    return;
  }

  const deleted = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`${colors.red}✗${colors.reset} Tâche supprimée: "${deleted[0].title}"`);
}

function viewTask(taskId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    console.log('❌ Tâche non trouvée');
    return;
  }

  const status = task.completed ? `${colors.green}✓ Complétée${colors.reset}` : `${colors.yellow}○ En attente${colors.reset}`;
  const priorityColor = getPriorityColor(task.priority);
  
  console.log(`\n${colors.blue}📝 Détails de la tâche${colors.reset}\n`);
  console.log(`Titre: ${task.title}`);
  console.log(`ID: ${task.id}`);
  console.log(`Statut: ${status}`);
  console.log(`Priorité: ${priorityColor}${task.priority}${colors.reset}`);
  console.log(`Catégorie: ${task.category}`);
  console.log(`Créée: ${new Date(task.createdAt).toLocaleDateString('fr-FR')}`);
  if (task.dueDate) {
    console.log(`Échéance: ${formatDate(task.dueDate)}`);
  }
  if (task.completedAt) {
    console.log(`Complétée le: ${new Date(task.completedAt).toLocaleDateString('fr-FR')}`);
  }
  console.log();
}

function listCategories() {
  const tasks = loadTasks();
  const categories = {};
  
  tasks.forEach(task => {
    if (!categories[task.category]) {
      categories[task.category] = { total: 0, completed: 0 };
    }
    categories[task.category].total++;
    if (task.completed) categories[task.category].completed++;
  });

  console.log(`\n${colors.blue}📂 Catégories${colors.reset}\n`);
  Object.keys(categories).sort().forEach(cat => {
    const stats = categories[cat];
    const percentage = Math.round((stats.completed / stats.total) * 100);
    console.log(`${getCategoryIcon(cat)} ${cat}: ${stats.completed}/${stats.total} (${percentage}%)`);
  });
  console.log();
}

function showOverdue() {
  const tasks = loadTasks();
  const overdue = tasks.filter(t => !t.completed && isDateOverdue(t.dueDate));
  
  if (overdue.length === 0) {
    console.log(`${colors.green}✓ Aucune tâche en retard!${colors.reset}\n`);
    return;
  }

  console.log(`\n${colors.red}⚠️  Tâches en retard${colors.reset}\n`);
  overdue.forEach(task => {
    console.log(`${colors.red}✗${colors.reset} ${task.title}`);
    console.log(`  ${formatDate(task.dueDate)} | ${task.category}`);
  });
  console.log();
}

function showUpcoming() {
  const tasks = loadTasks();
  const upcoming = tasks.filter(t => !t.completed && (isToday(t.dueDate) || isSoon(t.dueDate)));
  
  if (upcoming.length === 0) {
    console.log(`${colors.green}✓ Aucune tâche prévue très bientôt${colors.reset}\n`);
    return;
  }

  console.log(`\n${colors.cyan}📅 Tâches à venir${colors.reset}\n`);
  upcoming.forEach(task => {
    const priorityColor = getPriorityColor(task.priority);
    console.log(`${colors.cyan}→${colors.reset} ${task.title}`);
    console.log(`  ${formatDate(task.dueDate)} | ${task.category} | ${priorityColor}${task.priority}${colors.reset}`);
  });
  console.log();
}

function showStats() {
  const tasks = loadTasks();
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => !t.completed && isDateOverdue(t.dueDate)).length;
  
  console.log(`\n${colors.blue}📊 Statistiques${colors.reset}\n`);
  console.log(`Total de tâches: ${tasks.length}`);
  console.log(`${colors.green}Complétées: ${completed}${colors.reset}`);
  console.log(`${colors.yellow}En attente: ${pending}${colors.reset}`);
  console.log(`${colors.red}En retard: ${overdue}${colors.reset}`);
  const percentage = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  console.log(`Progression: ${percentage}%\n`);
}

function showHelp() {
  console.log(`${colors.blue}Task Manager CLI${colors.reset}`);
  console.log(`${colors.gray}Un gestionnaire de tâches sécurisé et puissant${colors.reset}\n`);
  
  console.log(`${colors.cyan}Commandes principales:${colors.reset}`);
  console.log(`  add <title>                 - Ajouter une nouvelle tâche`);
  console.log(`  list                        - Lister toutes les tâches`);
  console.log(`  list <category>             - Lister par catégorie`);
  console.log(`  view <task-id>              - Voir les détails d'une tâche`);
  console.log(`  done <task-id>              - Marquer une tâche comme complétée`);
  console.log(`  delete <task-id>            - Supprimer une tâche\n`);
  
  console.log(`${colors.cyan}Options pour 'add':${colors.reset}`);
  console.log(`  -c, --category <cat>        - Définir la catégorie (défaut: General)`);
  console.log(`  -d, --due <date>            - Définir l'échéance (format: YYYY-MM-DD)`);
  console.log(`  -p, --priority <level>      - Priorité: low, medium, high\n`);
  
  console.log(`${colors.cyan}Commandes utiles:${colors.reset}`);
  console.log(`  categories                  - Voir les statistiques par catégorie`);
  console.log(`  overdue                     - Voir les tâches en retard`);
  console.log(`  upcoming                    - Voir les tâches à venir`);
  console.log(`  stats                       - Voir les statistiques générales`);
  console.log(`  help                        - Afficher cette aide\n`);
  
  console.log(`${colors.cyan}Exemples:${colors.reset}`);
  console.log(`  task-manager add "Faire les courses" -c Shopping -d 2026-05-20 -p high`);
  console.log(`  task-manager list Work`);
  console.log(`  task-manager view 1715949393581`);
  console.log(`  task-manager done 1715949393581`);
  console.log(`  task-manager overdue\n`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

switch (command) {
  case 'add':
    addTask(commandArgs);
    break;
  case 'list':
    listTasks(commandArgs[0] || null);
    break;
  case 'view':
    viewTask(parseInt(commandArgs[0]));
    break;
  case 'done':
    completeTask(parseInt(commandArgs[0]));
    break;
  case 'delete':
    deleteTask(parseInt(commandArgs[0]));
    break;
  case 'categories':
    listCategories();
    break;
  case 'overdue':
    showOverdue();
    break;
  case 'upcoming':
    showUpcoming();
    break;
  case 'stats':
    showStats();
    break;
  case 'help':
    showHelp();
    break;
  default:
    showHelp();
}
