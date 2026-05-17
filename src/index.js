const TaskService = require('./core/task-service');
const { handleCLI } = require('./ui/cli-handler');

async function main() {
  const taskService = new TaskService();
  await taskService.init();

  const args = process.argv.slice(2);
  await handleCLI(taskService, args);
}

main().catch(error => {
  console.error('⚠️ Une erreur fatale est survenue lors de l\'exécution:', error);
  process.exit(1);
});
