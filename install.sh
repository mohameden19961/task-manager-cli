#!/bin/bash

# Installation script for task-manager-cli

echo "🚀 Installing Task Manager CLI..."

# Create .local/bin directory if it doesn't exist
mkdir -p ~/.local/bin

# Create the task-manager command
cat > ~/.local/bin/task-manager << 'EOF'
#!/bin/bash
node /tmp/opencode/task-manager-cli/index.js "$@"
EOF

# Make it executable
chmod +x ~/.local/bin/task-manager

# Check if .local/bin is in PATH
if [[ ":$PATH:" == *":$HOME/.local/bin:"* ]]; then
    echo "✓ ~/.local/bin is already in PATH"
else
    echo "⚠️  Adding ~/.local/bin to PATH..."
    # Add to .bashrc
    if [ -f ~/.bashrc ]; then
        echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
    fi
    # Add to .zshrc
    if [ -f ~/.zshrc ]; then
        echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc
    fi
fi

# Test the installation
echo ""
echo "Testing installation..."
task-manager --help 2>&1 | head -5

echo ""
echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  task-manager add \"Your task here\""
echo "  task-manager list"
echo "  task-manager done <index>"
echo "  task-manager delete <index>"
echo ""
echo "Try: task-manager list"
