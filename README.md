# Task Manager CLI

A simple, fast, and powerful command-line task manager for developers.

## Features

- ✨ **Simple** - Minimal, no unnecessary features
- ⚡ **Fast** - Instant command execution
- 💾 **Persistent** - Tasks saved in `~/.tasks.json`
- 🎯 **Developer-friendly** - Perfect for terminal lovers
- 🐳 **Dockerized** - Optional Docker support
- 📦 **Zero dependencies** - Pure Node.js

## Installation

### Quick Setup (Recommended)
```bash
bash <(curl -s https://raw.githubusercontent.com/mohameden19961/task-manager-cli/master/install.sh)
```

Or manually:
```bash
# Clone the repository
git clone https://github.com/mohameden19961/task-manager-cli.git
cd task-manager-cli

# Run the install script
chmod +x install.sh
./install.sh

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc
```

### After Installation
You can use `task-manager` from anywhere:
```bash
task-manager list
task-manager add "Your task"
```

## Quick Start

```bash
# Add a task
task-manager add "Learn Docker"

# View all tasks
task-manager list

# Mark task as done (use the number from list)
task-manager done 1

# Delete a task
task-manager delete 1

# Get help
task-manager
```

## Full Usage Guide

### Add a Task
```bash
task-manager add "Buy groceries"
task-manager add "Finish project report"
task-manager add "Call the dentist"
```

### List All Tasks
```bash
task-manager list
```

Output example:
```
📋 Vos tâches:

1. [○] Buy groceries
2. [✓] Finish project report
3. [○] Call the dentist
```

Legend:
- `[○]` = Incomplete task
- `[✓]` = Completed task
- Number = Index (used for marking done/deleting)

### Mark Task as Done
```bash
task-manager done 1
```

This will mark the first task as completed. The task remains in the list but marked with `[✓]`.

### Delete a Task
```bash
task-manager delete 1
```

This permanently removes the first task from your list.

### Get Help
```bash
task-manager
```

Shows all available commands.

## Examples

### Project Management
```bash
task-manager add "Design database schema"
task-manager add "Set up API endpoints"
task-manager add "Write unit tests"
task-manager add "Deploy to production"

task-manager list

# As you complete tasks
task-manager done 1
task-manager done 2
task-manager list
```

### Shopping List
```bash
task-manager add "Eggs"
task-manager add "Milk"
task-manager add "Bread"
task-manager add "Cheese"

task-manager list

# Mark as purchased
task-manager done 1
task-manager done 3
```

### Learning Goals
```bash
task-manager add "Learn Node.js"
task-manager add "Master Docker"
task-manager add "Understand GraphQL"
task-manager add "Study React Hooks"

task-manager list
```

## Data Storage

Tasks are stored in: **`~/.tasks.json`**

Each task contains:
- `id`: Unique timestamp identifier
- `title`: Task description
- `completed`: Boolean status
- `createdAt`: ISO 8601 timestamp

**Example:**
```json
[
  {
    "id": 1715949393581,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-17T14:09:53.581Z"
  }
]
```

You can manually edit this file if needed!

## Docker Support

Run the application in a container:

```bash
cd /tmp/opencode/task-manager-cli
docker compose up --build
```

This includes:
- Node.js application container
- MySQL database container
- Port mapping: 9001 (app) and 15000 (database)

## System Requirements

- **Node.js**: v14 or higher
- **Operating System**: Linux, macOS, or Windows (WSL)
- **Disk Space**: < 1MB (just the files)

## Troubleshooting

### Command not found
If you get "command not found: task-manager":
```bash
# Make sure PATH is updated
echo $PATH | grep .local/bin

# If not there, add it manually
export PATH="$PATH:$HOME/.local/bin"

# Test again
task-manager list
```

### Permission denied
```bash
chmod +x ~/.local/bin/task-manager
chmod +x /tmp/opencode/task-manager-cli/index.js
```

### Cannot find tasks.json
First run creates it automatically:
```bash
task-manager add "First task"
```

## Project Structure

```
task-manager-cli/
├── index.js              # Main CLI application
├── package.json          # Project metadata
├── README.md            # This file
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── install.sh           # Installation script
└── .gitignore          # Git ignore rules
```

## Contributing

Found a bug? Have a feature idea? Open an issue on GitHub!

**Repository**: https://github.com/mohameden19961/task-manager-cli

## Advanced Usage

### Batch Operations
```bash
# Add multiple tasks quickly
for task in "Email boss" "Review PR" "Update docs"; do
  task-manager add "$task"
done

# List and check
task-manager list
```

### Shell Alias (Optional)
Add to your `.zshrc` or `.bashrc`:
```bash
alias tm="task-manager"
```

Then use:
```bash
tm add "New task"
tm list
tm done 1
```

### Combining with Other Tools
```bash
# Count total tasks
task-manager list | wc -l

# Export to file
task-manager list > my_tasks.txt

# Parse JSON directly
cat ~/.tasks.json | jq '.[].title'
```

## License

MIT - Feel free to use, modify, and distribute!

## Author

**mohameden19961**

Created with ❤️ for developers who love the terminal.

---

## Quick Reference Card

| Command | Description | Example |
|---------|-------------|---------|
| `task-manager add <title>` | Add new task | `task-manager add "Buy milk"` |
| `task-manager list` | Show all tasks | `task-manager list` |
| `task-manager done <n>` | Mark task as done | `task-manager done 1` |
| `task-manager delete <n>` | Delete task | `task-manager delete 1` |
| `task-manager` | Show help | `task-manager` |

**Pro Tip:** Use `task-manager list` frequently to keep track of your progress!

