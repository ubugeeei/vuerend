import app from "./app";
import { createRequestHandler } from "@vue-server/core";
import { serveNode } from "@vue-server/node";

const handler = createRequestHandler({ app });

serveNode(handler, {
  hostname: "127.0.0.1",
  port: 3000,
});
