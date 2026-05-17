const StorageFactory = require('../storage/storage-factory');
const settings = require('../config/settings');
const { colors, formatDate, getCategoryIcon, getPriorityColor, isDateOverdue, isToday, isSoon } = require('../ui/formatter');
const { askConfirmation } = require('../ui/prompts');

class TaskService {
  constructor() {
    this.storage = StorageFactory.getStorage();
  }

  async init() {
    await this.storage.connect();
  }

  async load() {
    return await this.storage.loadTasks();
  }

  async save(tasks) {
    await this.storage.saveTasks(tasks);
  }

  parseArgs(args) {
    const options = {
      title: '',
      category: 'General',
      dueDate: null,
      priority: 'medium',
      tags: [],
      repeat: null
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
      } else if (args[i] === '--tags' || args[i] === '-t') {
        if (args[i + 1]) {
          options.tags = args[i + 1].split(',').map(t => t.trim()).filter(Boolean);
        }
        i += 2;
      } else if (args[i] === '--repeat' || args[i] === '-r') {
        options.repeat = args[i + 1] ? args[i + 1].toLowerCase() : null;
        i += 2;
      } else {
        options.title += (options.title ? ' ' : '') + args[i];
        i++;
      }
    }

    return options;
  }

  async addTask(args) {
    const options = this.parseArgs(args);
    
    if (!options.title.trim()) {
      console.log('❌ Erreur: Le titre de la tâche est requis');
      return;
    }

    const tasks = await this.load();
    const task = {
      id: Date.now(),
      title: options.title.trim(),
      category: options.category,
      priority: options.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: options.dueDate || null,
      recurrence: options.repeat || null,
      tags: options.tags || []
    };

    tasks.push(task);
    await this.save(tasks);
    
    console.log(`${colors.green}✓${colors.reset} Tâche ajoutée: "${options.title.trim()}"`);
    if (options.dueDate) console.log(`  Échéance: ${formatDate(options.dueDate)}`);
    if (options.category !== 'General') console.log(`  Catégorie: ${options.category}`);
    if (options.priority !== 'medium') console.log(`  Priorité: ${options.priority}`);
    if (options.tags && options.tags.length > 0) console.log(`  Tags: ${options.tags.map(t => `#${t}`).join(', ')}`);
    if (options.repeat) console.log(`  Récurrence: ${options.repeat}`);
  }

  async listTasks(filterCategory = null, filterTag = null) {
    const tasks = await this.load();
    
    let filteredTasks = tasks;
    if (filterCategory) {
      filteredTasks = filteredTasks.filter(t => t.category === filterCategory);
    }
    if (filterTag) {
      filteredTasks = filteredTasks.filter(t => t.tags && t.tags.includes(filterTag));
    }

    if (filteredTasks.length === 0) {
      console.log(`${colors.gray}Aucune tâche trouvée! (Utilisateur: ${settings.username})${colors.reset}\n`);
      return;
    }

    // Group by category
    const grouped = {};
    filteredTasks.forEach(task => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });

    console.log(`\n${colors.blue}📋 Vos tâches (Utilisateur: ${settings.username})${colors.reset}\n`);

    Object.keys(grouped).sort().forEach(category => {
      console.log(`${getCategoryIcon(category)} ${colors.blue}${category}${colors.reset}`);
      
      grouped[category].forEach((task) => {
        const priorityColor = getPriorityColor(task.priority);
        const status = task.completed ? `${colors.green}✓${colors.reset}` : '○';
        const priorityStr = task.priority === 'medium' ? '' : ` [${priorityColor}${task.priority}${colors.reset}]`;
        const dueDateStr = task.dueDate ? ` | ${formatDate(task.dueDate)}` : '';
        const tagsStr = (task.tags && task.tags.length > 0) ? ` ${colors.gray}(${task.tags.map(t => `#${t}`).join(' ')})${colors.reset}` : '';
        const repeatStr = task.recurrence ? ` 🔄 ${colors.cyan}${task.recurrence}${colors.reset}` : '';
        
        console.log(`  ${task.id} [${status}] ${task.title}${priorityStr}${dueDateStr}${tagsStr}${repeatStr}`);
      });
      console.log();
    });
  }

  async listTags() {
    const tasks = await this.load();
    const tagsCount = {};
    
    tasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => {
          tagsCount[tag] = (tagsCount[tag] || 0) + 1;
        });
      }
    });

    const tags = Object.keys(tagsCount).sort();
    if (tags.length === 0) {
      console.log(`${colors.gray}Aucun tag trouvé pour le moment!${colors.reset}\n`);
      return;
    }

    console.log(`\n${colors.blue}🏷️  Tags existants${colors.reset}\n`);
    tags.forEach(tag => {
      console.log(`  #${tag} (${tagsCount[tag]} tâche(s))`);
    });
    console.log();
  }

  async searchTasks(query) {
    const tasks = await this.load();
    const term = query.toLowerCase().trim();

    if (!term) {
      console.log('❌ Erreur: Terme de recherche requis');
      return;
    }

    const results = tasks.filter(task => {
      const matchTitle = task.title.toLowerCase().includes(term);
      const matchCategory = task.category.toLowerCase().includes(term);
      const matchPriority = task.priority.toLowerCase().includes(term);
      const matchTags = task.tags ? task.tags.some(tag => tag.toLowerCase().includes(term)) : false;
      return matchTitle || matchCategory || matchPriority || matchTags;
    });

    if (results.length === 0) {
      console.log(`${colors.yellow}Aucun résultat trouvé pour "${query}"${colors.reset}\n`);
      return;
    }

    console.log(`\n${colors.cyan}🔍 Résultats de recherche pour "${query}" (${results.length} trouvé(s))${colors.reset}\n`);
    results.forEach(task => {
      const priorityColor = getPriorityColor(task.priority);
      const status = task.completed ? `${colors.green}✓${colors.reset}` : '○';
      const priorityStr = task.priority === 'medium' ? '' : ` [${priorityColor}${task.priority}${colors.reset}]`;
      const dueDateStr = task.dueDate ? ` | ${formatDate(task.dueDate)}` : '';
      const tagsStr = (task.tags && task.tags.length > 0) ? ` ${colors.gray}(${task.tags.map(t => `#${t}`).join(' ')})${colors.reset}` : '';
      const repeatStr = task.recurrence ? ` 🔄 ${colors.cyan}${task.recurrence}${colors.reset}` : '';
      
      console.log(`  ${task.id} [${status}] ${colors.blue}[${task.category}]${colors.reset} ${task.title}${priorityStr}${dueDateStr}${tagsStr}${repeatStr}`);
    });
    console.log();
  }

  handleRecurrence(completedTask) {
    if (!completedTask.recurrence) return null;

    const nextDueDate = new Date(completedTask.dueDate || new Date());
    
    switch (completedTask.recurrence) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      default:
        return null;
    }

    return {
      id: Date.now(),
      title: completedTask.title,
      category: completedTask.category,
      priority: completedTask.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: nextDueDate.toISOString().split('T')[0],
      recurrence: completedTask.recurrence,
      tags: completedTask.tags || []
    };
  }

  async completeTask(taskId) {
    const tasks = await this.load();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log('❌ Tâche non trouvée');
      return;
    }

    task.completed = true;
    task.completedAt = new Date().toISOString();

    const nextTask = this.handleRecurrence(task);
    if (nextTask) {
      tasks.push(nextTask);
      console.log(`${colors.cyan}🔄 Tâche récurrente détectée. Nouvelle occurrence créée pour le : ${nextTask.dueDate}${colors.reset}`);
    }

    await this.save(tasks);
    console.log(`${colors.green}✓${colors.reset} Tâche complétée: "${task.title}"`);
  }

  async deleteTask(taskId) {
    const tasks = await this.load();
    const index = tasks.findIndex(t => t.id === taskId);
    
    if (index === -1) {
      console.log('❌ Tâche non trouvée');
      return;
    }

    const deleted = tasks.splice(index, 1);
    await this.save(tasks);
    console.log(`${colors.red}✗${colors.reset} Tâche supprimée: "${deleted[0].title}"`);
  }

  async viewTask(taskId) {
    const tasks = await this.load();
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
    if (task.tags && task.tags.length > 0) {
      console.log(`Tags: ${task.tags.map(t => `#${t}`).join(', ')}`);
    }
    if (task.recurrence) {
      console.log(`Récurrence: ${colors.cyan}${task.recurrence}${colors.reset}`);
    }
    console.log(`Créée: ${new Date(task.createdAt).toLocaleDateString('fr-FR')}`);
    if (task.dueDate) {
      console.log(`Échéance: ${formatDate(task.dueDate)}`);
    }
    if (task.completedAt) {
      console.log(`Complétée le: ${new Date(task.completedAt).toLocaleDateString('fr-FR')}`);
    }
    console.log();
  }

  async listCategories() {
    const tasks = await this.load();
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

  async showOverdue() {
    const tasks = await this.load();
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

  async showUpcoming() {
    const tasks = await this.load();
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

  async showStats() {
    const tasks = await this.load();
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

  async clearAllTasks() {
    const tasks = await this.load();
    
    if (tasks.length === 0) {
      console.log(`${colors.yellow}Aucune tâche à supprimer${colors.reset}`);
      return;
    }

    console.log(`${colors.red}⚠️  Attention: Vous allez supprimer TOUTES les ${tasks.length} tâche(s)${colors.reset}`);
    const confirmed = await askConfirmation('Are you sure? y/n');
    if (confirmed) {
      await this.save([]);
      console.log(`${colors.red}✗${colors.reset} ${tasks.length} tâche(s) supprimée(s)`);
    } else {
      console.log(`${colors.gray}Opération annulée${colors.reset}`);
    }
  }

  async clearCompletedTasks() {
    const tasks = await this.load();
    const completed = tasks.filter(t => t.completed);
    
    if (completed.length === 0) {
      console.log(`${colors.green}✓ Aucune tâche complétée à supprimer${colors.reset}`);
      return;
    }

    console.log(`${colors.red}⚠️  Attention: Vous allez supprimer ${completed.length} tâche(s) complétée(s)${colors.reset}`);
    const confirmed = await askConfirmation('Are you sure? y/n');
    if (confirmed) {
      const remaining = tasks.filter(t => !t.completed);
      await this.save(remaining);
      console.log(`${colors.red}✗${colors.reset} ${completed.length} tâche(s) complétée(s) supprimée(s)`);
    } else {
      console.log(`${colors.gray}Opération annulée${colors.reset}`);
    }
  }

  async markAllCompleted() {
    const tasks = await this.load();
    const pending = tasks.filter(t => !t.completed);
    
    if (pending.length === 0) {
      console.log(`${colors.green}✓ Toutes les tâches sont déjà complétées${colors.reset}`);
      return;
    }

    console.log(`${colors.yellow}ℹ️  Vous allez marquer ${pending.length} tâche(s) comme complétée(s)${colors.reset}`);
    const confirmed = await askConfirmation('Are you sure? y/n');
    if (confirmed) {
      const now = new Date().toISOString();
      tasks.forEach(task => {
        if (!task.completed) {
          task.completed = true;
          task.completedAt = now;
        }
      });
      await this.save(tasks);
      console.log(`${colors.green}✓${colors.reset} ${pending.length} tâche(s) marquée(s) comme complétée(s)`);
    } else {
      console.log(`${colors.gray}Opération annulée${colors.reset}`);
    }
  }

  async resetAllTasks() {
    const tasks = await this.load();
    const completed = tasks.filter(t => t.completed);
    
    if (completed.length === 0) {
      console.log(`${colors.green}✓ Toutes les tâches sont déjà en attente${colors.reset}`);
      return;
    }

    console.log(`${colors.yellow}ℹ️  Vous allez marquer ${completed.length} tâche(s) comme non complétée(s)${colors.reset}`);
    const confirmed = await askConfirmation('Are you sure? y/n');
    if (confirmed) {
      tasks.forEach(task => {
        task.completed = false;
        task.completedAt = null;
      });
      await this.save(tasks);
      console.log(`${colors.green}✓${colors.reset} ${completed.length} tâche(s) marquée(s) comme non complétée(s)`);
    } else {
      console.log(`${colors.gray}Opération annulée${colors.reset}`);
    }
  }
}

module.exports = TaskService;
