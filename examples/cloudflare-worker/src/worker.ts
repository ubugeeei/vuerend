import app from "./app";
import { createRequestHandler } from "@vue-server/core";
import { serveCloudflare } from "@vue-server/cloudflare";

const handler = createRequestHandler({ app });

export default serveCloudflare(handler);
