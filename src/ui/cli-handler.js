const { colors } = require('./formatter');

function showHelp() {
   console.log(`${colors.blue}Task Manager CLI${colors.reset}`);
   console.log(`${colors.gray}Un gestionnaire de tâches sécurisé, puissant et modulaire${colors.reset}\n`);
   
   console.log(`${colors.cyan}Commandes principales:${colors.reset}`);
   console.log(`  add <title>                 - Ajouter une nouvelle tâche`);
   console.log(`  list                        - Lister toutes les tâches`);
   console.log(`  list <category>             - Lister par catégorie`);
   console.log(`  list --tag <tag>            - Lister les tâches filtrées par tag`);
   console.log(`  tags                        - Voir tous les tags existants`);
   console.log(`  search <mot-clé>            - Rechercher des tâches par mot-clé`);
   console.log(`  view <task-id>              - Voir les détails d'une tâche`);
   console.log(`  done <task-id>              - Marquer une tâche comme complétée`);
   console.log(`  delete <task-id>            - Supprimer une tâche\n`);
   
   console.log(`${colors.cyan}Options pour 'add':${colors.reset}`);
   console.log(`  -c, --category <cat>        - Définir la catégorie (défaut: General)`);
   console.log(`  -d, --due <date>            - Définir l'échéance (format: YYYY-MM-DD)`);
   console.log(`  -p, --priority <level>      - Priorité: low, medium, high`);
   console.log(`  -t, --tags <t1,t2...>       - Définir des tags séparés par des virgules`);
   console.log(`  -r, --repeat <rule>         - Répétition: daily, weekly, monthly\n`);
   
   console.log(`${colors.cyan}Commandes utiles:${colors.reset}`);
   console.log(`  categories                  - Voir les statistiques par catégorie`);
   console.log(`  overdue                     - Voir les tâches en retard`);
   console.log(`  upcoming                    - Voir les tâches à venir`);
   console.log(`  stats                       - Voir les statistiques générales`);
   console.log(`  help                        - Afficher cette aide\n`);

   console.log(`${colors.cyan}Commandes globales:${colors.reset}`);
   console.log(`  clear                       - Supprimer TOUTES les tâches`);
   console.log(`  clear-done                  - Supprimer les tâches complétées`);
   console.log(`  done-all                    - Marquer TOUTES les tâches comme complétées`);
   console.log(`  reset                       - Marquer TOUTES les tâches comme non complétées\n`);
   
   console.log(`${colors.cyan}Exemples:${colors.reset}`);
   console.log(`  task-manager add "Faire les courses" -c Shopping -d 2026-05-20 -p high -t alimentation,urgent`);
   console.log(`  task-manager add "Backup DB" --repeat daily -c Work`);
   console.log(`  task-manager list --tag urgent`);
   console.log(`  task-manager search "Backup"`);
   console.log(`  task-manager overdue\n`);
}

async function handleCLI(taskService, args) {
  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case 'add':
      await taskService.addTask(commandArgs);
      break;
    case 'list':
      if (commandArgs[0] === '--tag' || commandArgs[0] === '-t') {
        await taskService.listTasks(null, commandArgs[1]);
      } else {
        await taskService.listTasks(commandArgs[0] || null);
      }
      break;
    case 'tags':
      await taskService.listTags();
      break;
    case 'search':
      await taskService.searchTasks(commandArgs.join(' '));
      break;
    case 'view':
      await taskService.viewTask(parseInt(commandArgs[0]));
      break;
    case 'done':
      await taskService.completeTask(parseInt(commandArgs[0]));
      break;
    case 'delete':
      await taskService.deleteTask(parseInt(commandArgs[0]));
      break;
    case 'categories':
      await taskService.listCategories();
      break;
    case 'overdue':
      await taskService.showOverdue();
      break;
    case 'upcoming':
      await taskService.showUpcoming();
      break;
    case 'stats':
      await taskService.showStats();
      break;
    case 'clear':
      await taskService.clearAllTasks();
      break;
    case 'clear-done':
      await taskService.clearCompletedTasks();
      break;
    case 'done-all':
      await taskService.markAllCompleted();
      break;
    case 'reset':
      await taskService.resetAllTasks();
      break;
    case 'help':
    case undefined:
      showHelp();
      break;
    default:
      console.log(`❌ Commande inconnue: "${command}". Utilisez "help" pour voir la liste des commandes.`);
  }
}

module.exports = {
  handleCLI,
  showHelp
};
