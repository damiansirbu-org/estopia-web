#!/bin/bash

# Estopia Frontend Stop Script
# Stops the Vite development server

set -e

echo "🛑 Stopping Estopia Frontend..."

# Find and kill Vite processes
PIDS=$(ps aux | grep '[n]ode.*vite' | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "No Vite development server found."
else
    echo "Found Vite processes: $PIDS"
    for PID in $PIDS; do
        echo "Stopping process $PID..."
        kill $PID
    done
    
    # Wait a moment and check if processes are stopped
    sleep 2
    REMAINING=$(ps aux | grep '[n]ode.*vite' | awk '{print $2}')
    
    if [ -z "$REMAINING" ]; then
        echo "✅ Frontend stopped successfully!"
    else
        echo "⚠️ Some processes may still be running: $REMAINING"
        echo "Use 'kill -9 $REMAINING' if needed."
    fi
fi