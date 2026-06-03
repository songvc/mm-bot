import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);

// Native binding loader
let mmCore;
try {
  mmCore = require(path.resolve("../build/mm_core.node"));
} catch (e) {
  console.error("⚠️ Local native binary not compiled yet. Bootstrapping mock interface.");
  mmCore = {
    getBotStatus: () => "Engine Status: MOCK (Compilation required)",
    updateSpread: (a, b) => {},
    killSwitch: () => true,
    getRiskMetrics: () => "InventoryDelta: 0.0 | GPU-Alpha-Signal: 0.0"
  };
}

const server = new Server(
  { name: "CUDA-MM-Bot-Controller", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

// Map Tool Specs
const tools = {
  get_system_status: {
    description: "Fetches live operational telemetry from the low-latency C++/CUDA trading engine.",
    schema: z.object({}),
    execute: async () => `Engine Telemetry:\n${mmCore.getBotStatus()}`
  },
  adjust_market_making_spread: {
    description: "Hot-reloads quotation spread offsets on the running order book engine.",
    schema: z.object({
      askPct: z.number().positive().describe("Ask markup percentage"),
      bidPct: z.number().positive().describe("Bid markdown percentage")
    }),
    execute: async ({ askPct, bidPct }) => {
      mmCore.updateSpread(askPct, bidPct);
      return `Successfully shifted spreads: Ask +${askPct}%, Bid -${bidPct}%`;
    }
  },
  trigger_emergency_halt: {
    description: "CRITICAL: Hard kill-switch. Instantly purges open orders across venues and pauses loops.",
    schema: z.object({}),
    execute: async () => {
      mmCore.killSwitch();
      return "CRITICAL ALERT: Core kill-switch invoked. Market maker halted safely.";
    }
  }
};

// Tool Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Object.entries(tools).map(([name, t]) => ({
    name, description: t.description, inputSchema: { type: "object" } // Schema validation handled in engine loop
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = tools[req.params.name];
  if (!tool) throw new Error("Tool not found");
  const text = await tool.execute(req.params.arguments || {});
  return { content: [{ type: "text", text }] };
});

// Resource Handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [{
    uri: "marketbot://risk/metrics",
    name: "Live Risk Profile",
    mimeType: "text/plain",
    description: "Real-time inventory risk variables computed via CUDA kernels on the GPU."
  }]
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  if (req.params.uri === "marketbot://risk/metrics") {
    return { contents: [{ uri: req.params.uri, text: mmCore.getRiskMetrics() }] };
  }
  throw new Error("Resource not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🚀 JavaScript FastMCP Server initialized via Stdio.");
