#!/bin/bash
set -e

echo "⚙️ Initializing Workspace folders..."
mkdir -p mm-market-bot-2/{src/{core,cuda,api},mcp_server}
cd mm-market-bot-2

echo "📦 Setting up root workspace dependencies for Node Addon API..."
cat << 'EOF' > package.json
{
  "name": "mm-market-bot-root",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "node-addon-api": "^8.0.0"
  }
}
EOF
npm install

echo "🚀 Constructing FastMCP application profile..."
cd mcp_server
cat << 'EOF' > package.json
{
  "name": "cuda-mm-bot-mcp",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "dependencies": {
    "fastmcp": "^3.0.0",
    "zod": "^3.23.0"
  }
}
EOF
npm install

# Write empty shell targets for C++ file alignment safety
cd ../src
touch main.cpp core/orderbook.cpp core/orderbook.hpp core/engine.cpp core/engine.hpp cuda/kernels.cu

echo "✅ Environment configured cleanly."
