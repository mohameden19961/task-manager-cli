# Task Manager CLI

A simple command-line task manager built with Node.js.

## Features

- ✓ Add tasks
- ✓ List all tasks
- ✓ Mark tasks as completed
- ✓ Delete tasks
- ✓ Persistent storage (stored in ~/.tasks.json)

## Installation

### Option 1: Install globally (requires npm permissions)
```bash
npm install -g task-manager-cli
```

### Option 2: Use with npx (recommended)
```bash
npx task-manager-cli@latest <command>
```

### Option 3: Local usage
```bash
cd /path/to/task-manager-cli
npx . <command>
```

## Usage

### Using globally installed package
```bash
# Add a new task
task-manager add "Buy groceries"

# List all tasks
task-manager list

# Mark task as done
task-manager done 1

# Delete a task
task-manager delete 1

# Show help
task-manager
```

### Using with npx
```bash
# Add a new task
npx task-manager-cli@latest add "Buy groceries"

# List all tasks
npx task-manager-cli@latest list

# Mark task as done
npx task-manager-cli@latest done 1

# Delete a task
npx task-manager-cli@latest delete 1
```

## Examples

```bash
# Add multiple tasks
npx . add "Learn Docker"
npx . add "Deploy to GitHub"
npx . add "Write documentation"

# View all tasks
npx . list

# Complete a task
npx . done 1

# Delete a completed task
npx . delete 1
```

## Data Storage

Tasks are stored in JSON format at `~/.tasks.json`. Each task contains:
- `id`: Unique timestamp identifier
- `title`: Task description
- `completed`: Boolean status
- `createdAt`: ISO timestamp

## Docker Support

This project includes Docker configuration. Run it in a container:

```bash
docker compose up --build
```

The container will listen on port 9001 and includes a MySQL database on port 15000.

## License

MIT
