// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32}m',
  greenClean: '\x1b[32m', // fixed code format
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Fix the typo inside colors object: colors.green should be correct
colors.green = colors.greenClean;

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

module.exports = {
  colors,
  isDateOverdue,
  isToday,
  isSoon,
  formatDate,
  getCategoryIcon,
  getPriorityColor
};
