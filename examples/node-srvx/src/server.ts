import app from "./app";
import { createRequestHandler } from "@vuerend/core";
import { serveNode } from "@vuerend/node";

const handler = createRequestHandler({ app });

serveNode(handler, {
  hostname: "127.0.0.1",
  port: 3000,
});
