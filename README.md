
# 🤖 High-Frequency Market Making Bot (C++ with MCP Node Bindings)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: C++20](https://img.shields.io/badge/Language-C%2B%2B20-blue.svg)](https://en.wikipedia.org/wiki/C%2B%2B20)
[![Node.js Bindings](https://img.shields.io/badge/Node.js-N--API-green.svg)](https://nodejs.org/api/n-api.html)

A ultra-low latency, high-frequency **Market Making Bot** engineered in C++ for real-time order book management and liquidity provision. It features native Node.js bindings using `node-addon-api` and exposes operational tools via the **Model Context Protocol (MCP)**, allowing LLMs and external AI agents to monitor, tune, and orchestrate trading strategies seamlessly.

---

## 🚀 Key Features

* **Low-Latency C++ Engine:** Core order book parsing, theoretical pricing (fair value calculation), and inventory management built in C++20.
* **MCP Integration:** Built-in Model Context Protocol server support, enabling LLMs to safely query bot status, adjust spreads, and halt/resume trading.
* **Node.js Bindings:** Seamlessly control and stream data from the C++ engine into a Node.js/TypeScript ecosystem using N-API.
* **Lock-Free Architecture:** Multi-threaded execution utilizing lock-free ring buffers for incoming market data and outgoing order routing.
* **Risk Safeguards:** Hardcoded circuit breakers for max inventory delta, drawdown limits, and order rate-limiting.

---

## 🏗️ Architecture Overview

The system separates high-performance calculation (order book mechanics) from the orchestration layer (AI/MCP/Web UI):

┌─────────────────────────────────────────────────────────┐
│                LLM / MCP Client (Claude)                │
└────────────────────────────┬────────────────────────────┘
│ (JSON-RPC over SSE/Stdio)
▼
┌─────────────────────────────────────────────────────────┐
│                 Node.js / TypeScript Layer              │
│       • MCP Server Implementation                        │
│       • Gateway & Websocket Connections                 │
└────────────────────────────┬────────────────────────────┘
│ (Node-Addon-API / N-API)
▼
┌─────────────────────────────────────────────────────────┐
│                    C++ Trading Engine                   │
│       • Microsecond Order Book Math                     │
│       • Inventory & Risk Management                     │
└─────────────────────────────────────────────────────────┘


---

## 🛠️ Prerequisites

Before building, ensure you have the following installed:

* **CMake** (v3.15 or higher)
* **GCC 11+** or **Clang 13+** (Supporting C++20)
* **Node.js** (v18.x or higher)
* **npm** or **yarn**

---

## 📦 Installation & Build

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/market-making-mcp-bot.git](https://github.com/yourusername/market-making-mcp-bot.git)
cd market-making-mcp-bot

2. Install Node Dependencies & Compile C++ Bindings

This project uses node-gyp or cmake-js underlyingly via npm scripts to compile the native C++ code into a .node addon.
Bash

npm install
npm run build:addon

3. Build C++ Standalone (Optional for Testing)

If you want to run or debug the C++ engine independently of Node.js:
Bash

mkdir build && cd build
cmake .. -DBUILD_STANDALONE=ON
make -j$(nproc)

🚦 Usage
Running the MCP Bot Server

To start the bot alongside its MCP server interface:
Bash

npm run start

By default, this spins up the MCP server over stdio. You can configure it to use SSE (Server-Sent Events) in the configuration file.
Connecting your LLM (e.g., Claude Desktop)

To give an AI model control over the market maker, add this server block to your claude_desktop_config.json:
JSON

{
  "mcpServers": {
    "market-maker-bot": {
      "command": "node",
      "args": ["/path/to/market-making-mcp-bot/dist/index.js"]
    }
  }
}

🔌 MCP Tools & Resources Exposed

Once connected, the bot exposes the following capabilities to your LLM client:
Available Tools
Tool Name	Parameters	Description
get_bot_status	None	Returns current inventory, PnL, and active spread settings.
update_spread	bid_skew (float), ask_skew (float)	Dynamically tightens or widens market-making depths.
emergency_halt	reason (string)	Instantly cancels all open orders and stops trading.
Available Resources

    trading://live_metrics: Real-time JSON stream of mid-price, inventory delta, and theoretical edge.

⚙️ Configuration

Modify config.json to adjust market-making parameters, risk limits, and API keys.
JSON

{
  "trading": {
    "symbol": "BTC-USDT",
    "default_spread_bps": 5.0,
    "order_size": 0.01
  },
  "risk": {
    "max_inventory_delta": 0.5,
    "max_drawdown_usd": 500.0
  },
  "mcp": {
    "transport": "stdio",
    "port": 3000
  }
}

🧪 Running Tests
C++ Unit Tests (Catch2 / GTest)
Bash

cd build
ctest --output-on-failure

Node.js Integration Tests
Bash

npm run test

📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

    ⚠️ Disclaimer: This software is for educational and research purposes only. Crypto and traditional asset trading involve substantial risk. Use at your own risk.
