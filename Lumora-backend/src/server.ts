import "dotenv/config";

import { createServer } from "node:http";

import app from "./app.js";

const DEFAULT_PORT = 5000;
const PORT = getPort(process.env.PORT);
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }

  if (error.code === "EACCES") {
    console.error(`Port ${PORT} requires elevated privileges.`);
    process.exit(1);
  }

  throw error;
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

function getPort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return port;
}

function shutdown(signal: NodeJS.Signals): void {
  console.log(`${signal} received. Closing HTTP server...`);

  server.close((error) => {
    if (error) {
      console.error("Error while closing HTTP server:", error);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });
}
