import app from "./app";
import { createRequestHandler } from "@vuerend/core";
import { serveCloudflare } from "@vuerend/cloudflare";

const handler = createRequestHandler({ app });

export default serveCloudflare(handler);
