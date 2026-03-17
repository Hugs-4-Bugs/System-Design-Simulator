import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simulation State
  let simulationState = {
    isRunning: false,
    trafficLoad: 100, // requests per second
    chaosMode: {
      latency: 0,
      packetLoss: 0,
      failures: [],
    },
    nodes: {},
    edges: [],
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket Server for Real-Time Simulation
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to simulation");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "UPDATE_STATE") {
          simulationState = { ...simulationState, ...data.payload };
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    });

    // Send periodic simulation updates
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const metrics = calculateMetrics(simulationState);
        ws.send(JSON.stringify({ type: "METRICS_UPDATE", payload: metrics }));
      }
    }, 1000);

    ws.on("close", () => clearInterval(interval));
  });
}

function calculateMetrics(state) {
  // Simple simulation logic
  const metrics = {};
  const { trafficLoad, chaosMode } = state;

  Object.keys(state.nodes).forEach((nodeId) => {
    const node = state.nodes[nodeId];
    const instances = node.data?.instances || 1;
    const isFailed = chaosMode.failures.includes(nodeId);
    
    // Base metrics
    let rps = trafficLoad / (Object.keys(state.nodes).length || 1);
    let latency = 20 + Math.random() * 10 + chaosMode.latency;
    
    // Packet loss increases error rate
    let baseErrorRate = isFailed ? 100 : (rps > instances * 100 ? (rps - instances * 100) / rps * 100 : 0.1);
    let errorRate = baseErrorRate + (chaosMode.packetLoss || 0);
    
    metrics[nodeId] = {
      rps: isFailed ? 0 : Math.round(rps),
      latency: isFailed ? 0 : Math.round(latency),
      cpu: isFailed ? 0 : Math.min(100, Math.round((rps / (instances * 150)) * 100)),
      memory: isFailed ? 0 : Math.min(100, Math.round(40 + (rps / (instances * 200)) * 40)),
      errorRate: Math.round(errorRate * 10) / 10,
    };
  });

  return metrics;
}

startServer();
