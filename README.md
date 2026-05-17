# Task Manager CLI

A simple, fast, and powerful command-line task manager with categories, priorities, and due dates.

## ✨ Features

- 📋 **Task Management** - Add, complete, delete, and view tasks
- 🏷️ **Categories** - Organize tasks by Work, Personal, Shopping, Learning, Health, Home, etc.
- 🎯 **Priorities** - Set task priority (low, medium, high)
- 📅 **Due Dates** - Track task deadlines with smart date formatting
- 👤 **Per-user Isolation** - Each system user has separate, secure task storage
- 🔒 **Security** - Restricted file permissions (0o600, 0o700)
- 🔍 **Smart Filtering** - Filter tasks by category, view overdue/upcoming tasks
- 📊 **Statistics** - Track progress with category breakdown and completion stats
- 🎨 **Colored Output** - Beautiful terminal UI with emojis and colors
- ⚡ **Zero Dependencies** - Pure Node.js, no npm dependencies needed
- 🐳 **Docker Support** - Optional containerization

## Quick Installation

### Option 1: Quick Setup (Recommended)
```bash
bash <(curl -s https://raw.githubusercontent.com/mohameden19961/task-manager-cli/master/install.sh)
source ~/.zshrc  # or ~/.bashrc
```

### Option 2: Manual Installation
```bash
git clone https://github.com/mohameden19961/task-manager-cli.git
cd task-manager-cli
chmod +x install.sh
./install.sh
source ~/.zshrc
```

### Option 3: From anywhere with npx
```bash
npx mohameden-task-manager-cli add "Task title"
```

## 🚀 Quick Start

```bash
# Add a simple task
task-manager add "Buy groceries"

# Add a task with all options
task-manager add "Project deadline" -c Work -d 2026-05-20 -p high

# List all tasks
task-manager list

# Filter tasks by category
task-manager list Work

# View task details
task-manager view <task-id>

# Mark as done
task-manager done <task-id>

# Delete task
task-manager delete <task-id>
```

## 📖 Complete Command Reference

### Adding Tasks

```bash
# Basic task
task-manager add "Learn Node.js"

# With category
task-manager add "Buy milk" -c Shopping

# With due date
task-manager add "Submit report" -d 2026-05-20

# With priority
task-manager add "Critical bug fix" -p high

# With everything
task-manager add "Team meeting" -c Work -d 2026-05-18 -p high
```

**Options for `add`:**
- `-c, --category <name>` - Category (default: General)
  - Work, Personal, Shopping, Learning, Health, Home
- `-d, --due <date>` - Due date in format YYYY-MM-DD
- `-p, --priority <level>` - Priority: low, medium, high

### Listing Tasks

```bash
# List all tasks (grouped by category)
task-manager list

# Filter by category
task-manager list Work
task-manager list Shopping
task-manager list Health
```

### View Task Details

```bash
task-manager view 1779031200002
```

Shows:
- Title
- ID
- Status (Completed / Pending)
- Priority
- Category
- Created date
- Due date
- Completion date (if completed)

### Managing Tasks

```bash
# Mark task as completed
task-manager done 1779031200002

# Delete task
task-manager delete 1779031200002
```

### Analysis & Statistics

```bash
# View all statistics
task-manager stats

# Show by category breakdown
task-manager categories

# Show tasks due today or soon
task-manager upcoming

# Show overdue tasks
task-manager overdue

# Show help
task-manager help
```

## 📊 Statistics Commands

### `stats` - Overall Statistics
Shows:
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Overall progress percentage

### `categories` - Category Breakdown
Shows completion percentage for each category:
```
📂 Catégories

💼 Work: 5/10 (50%)
🛒 Shopping: 2/3 (66%)
📚 Learning: 1/1 (100%)
```

### `upcoming` - Tasks Due Soon
Shows tasks due today or within 7 days with:
- Task title
- Days remaining
- Category
- Priority

### `overdue` - Past Due Tasks
Shows tasks that haven't been completed past their due date:
- Task title
- Days overdue
- Category

## 💾 Data Storage

Tasks are stored securely in: **`~/.task-manager/<username>.json`**

### Security Features:
✅ **Per-user isolation** - Each system user has completely separate task file  
✅ **Restricted permissions** - Only owner can read/write (mode 0o600)  
✅ **Private directory** - `.task-manager` folder inaccessible to others (mode 0o700)  
✅ **No cross-user access** - Users cannot see other users' tasks  

### File Structure:
```
~/.task-manager/
├── abdy.json           (only user 'abdy' can read/write)
├── alice.json          (only user 'alice' can read/write)
└── bob.json            (only user 'bob' can read/write)
```

### Task JSON Format:
```json
{
  "id": 1779031200002,
  "title": "Buy groceries",
  "category": "Shopping",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-05-17T14:53:20.002Z",
  "dueDate": "2026-05-20",
  "completedAt": null
}
```

You can manually edit your task file if needed!

### Permission Details:
```bash
# Directory permissions (only owner can access)
drwx------   ~/.task-manager

# File permissions (only owner can read/write)
-rw-------   ~/.task-manager/username.json
```

## 🎨 UI Features

### Color Coding:
- 🔴 **Red** - High priority, overdue tasks, errors
- 🟡 **Yellow** - Medium priority, today's date, tomorrow
- 🟢 **Green** - Low priority, completed tasks
- 🔵 **Blue** - Categories, main headings
- 🔵 **Cyan** - Upcoming tasks, calendar info

### Status Indicators:
- `[✓]` - Task completed
- `[○]` - Task pending/not completed

### Category Emojis:
- 💼 Work
- 👤 Personal
- 🛒 Shopping
- 📚 Learning
- 🏥 Health
- 🏠 Home
- ✓ General

## 📚 Examples

### Project Management
```bash
# Create project tasks
task-manager add "Design database" -c Work -d 2026-05-25 -p high
task-manager add "Implement API" -c Work -d 2026-05-28 -p high
task-manager add "Write tests" -c Work -d 2026-05-30 -p medium
task-manager add "Deploy" -c Work -d 2026-06-02 -p high

# Track progress
task-manager list Work
task-manager stats
task-manager categories

# Update as you progress
task-manager done 1779031200002
task-manager list Work  # See updated progress
```

### Personal Planning
```bash
# Add personal tasks
task-manager add "Learn TypeScript" -c Learning -d 2026-06-01
task-manager add "Medical checkup" -c Health -d 2026-05-25 -p high
task-manager add "Call mom" -c Personal -d 2026-05-20

# Get today's tasks
task-manager upcoming

# View by category
task-manager list Learning
task-manager list Health
```

### Shopping List
```bash
task-manager add "Milk" -c Shopping -d 2026-05-18
task-manager add "Eggs" -c Shopping -d 2026-05-18
task-manager add "Bread" -c Shopping -d 2026-05-18

task-manager list Shopping
```

## 🔐 Security

This application takes security seriously:

- **User Isolation**: Each system user has completely separate task storage
- **File Permissions**: Task files are only readable/writable by their owner
- **No Network Access**: All data stays on your local machine
- **No Cross-user Access**: You cannot access other users' tasks
- **Secure Directory**: Task directory uses restrictive permissions

### Multi-user System Example:
```bash
# User 'alice' can only see their tasks
$ task-manager list
📋 Vos tâches (Utilisateur: alice):

💼 Work
  1779031200001 [○] Alice's project

# User 'bob' sees completely different tasks
$ task-manager list  
📋 Vos tâches (Utilisateur: bob):

🛒 Shopping
  1779031200005 [○] Bob's grocery list
```

## 🐳 Docker Support

Run the application in a containerized environment:

```bash
cd /tmp/opencode/task-manager-cli
docker compose up --build
```

This includes:
- Node.js application container
- MySQL database container
- Port mapping: 9001 (app) and 15000 (database)

## ⚙️ System Requirements

- **Node.js**: v14 or higher
- **Operating System**: Linux, macOS, or Windows (WSL)
- **Disk Space**: < 1MB
- **User Permissions**: Ability to create files in home directory

## 🛠️ Troubleshooting

### Command not found
```bash
# Verify PATH includes .local/bin
echo $PATH | grep .local/bin

# If missing, add manually
export PATH="$PATH:$HOME/.local/bin"

# Add to shell config
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc
```

### Permission denied
```bash
chmod +x ~/.local/bin/task-manager
chmod +x /tmp/opencode/task-manager-cli/index.js
```

### Tasks not found
```bash
# First use creates the storage
task-manager add "First task"

# Check if files exist
ls -la ~/.task-manager/
```

### Date formatting issues
```bash
# Use YYYY-MM-DD format for dates
task-manager add "Task" -d 2026-05-20  ✓ Correct
task-manager add "Task" -d 05-20-2026  ✗ Wrong
```

## 📦 Project Structure

```
task-manager-cli/
├── index.js              # Main application (380+ lines)
├── package.json          # Project metadata
├── README.md            # This documentation
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── install.sh           # Installation script
└── .gitignore          # Git ignore rules
```

## 🚀 Advanced Usage

### Shell Alias (Make it shorter)
Add to `~/.zshrc` or `~/.bashrc`:
```bash
alias tm="task-manager"
alias tl="task-manager list"
alias ts="task-manager stats"
```

Then use:
```bash
tm add "Task"
tl Work
ts
```

### Batch Operations
```bash
# Add multiple tasks
for task in "Email boss" "Review PR" "Update docs"; do
  task-manager add "$task" -c Work
done

# Complete all Work tasks for a category
task-manager list Work
```

### Scripting
```bash
#!/bin/bash
# Daily standup script
echo "📊 Daily Standup"
task-manager upcoming
task-manager stats
```

### Integration with other tools
```bash
# Export task list
task-manager list > tasks_backup.txt

# Count tasks
task-manager list | wc -l

# Parse with jq
cat ~/.task-manager/$(whoami).json | jq '.[].title'
```

## 🤝 Contributing

Found a bug? Have a feature idea? Contributions are welcome!

**Repository**: https://github.com/mohameden19961/task-manager-cli

### Ideas for Contributions:
- [ ] Task search functionality
- [ ] Task tags system
- [ ] Recurring tasks
- [ ] Export to CSV/JSON
- [ ] Web UI dashboard
- [ ] Sync across devices
- [ ] Task templates
- [ ] Pomodoro timer integration

## 📝 Changelog

### v1.1.0 - Categories & Dates Release
- ✨ Added task categories (Work, Shopping, Learning, etc.)
- ✨ Added due dates with smart formatting
- ✨ Added task priorities (low, medium, high)
- ✨ Added filtering by category
- ✨ Added statistics and analytics
- ✨ Added upcoming/overdue task views
- 🔒 Added per-user task isolation
- 🎨 Enhanced UI with colors and emojis

### v1.0.0 - Initial Release
- Basic task management (add, list, done, delete)
- Per-user security with file permissions
- Persistent JSON storage

## 📄 License

MIT - Feel free to use, modify, and distribute!

## 👤 Author

**mohameden19961** <abdymohameden439@gmail.com>

Created with ❤️ for developers who love the terminal.

---

## Quick Reference Card

| Command | Example |
|---------|---------|
| `add` | `task-manager add "Task" -c Work -d 2026-05-20 -p high` |
| `list` | `task-manager list` or `task-manager list Work` |
| `view` | `task-manager view 1779031200002` |
| `done` | `task-manager done 1779031200002` |
| `delete` | `task-manager delete 1779031200002` |
| `stats` | `task-manager stats` |
| `categories` | `task-manager categories` |
| `upcoming` | `task-manager upcoming` |
| `overdue` | `task-manager overdue` |
| `help` | `task-manager help` |

**Pro Tip:** Use `task-manager upcoming` and `task-manager overdue` daily to stay on top of your tasks!
