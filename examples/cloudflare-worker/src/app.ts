import WorkerPage from "./pages/WorkerPage";
import DeployPage from "./pages/DeployPage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  document: {
    title: "Cloudflare Worker",
    titleTemplate: "%s | Vue Server",
    head: '<meta name="theme-color" content="#142b52">',
    meta: [
      {
        name: "description",
        content: "Cloudflare Worker adapter example showing the same Vue Server app model at the edge.",
      },
      {
        property: "og:site_name",
        content: "Vue Server Examples",
      },
    ],
    stylesheets: ["/styles/site.css"],
  },
  middleware: [
    async (request, context, next) => {
      context.state.requestPath = new URL(request.url).pathname;
      context.state.requestHost = new URL(request.url).host;
      context.state.runtimeLabel = context.platform
        ? "Cloudflare runtime context detected"
        : "Local preview or static build request";

      const response = await next();
      response.headers.set("x-runtime", "cloudflare-worker");
      return response;
    },
  ],
  routes: [
    defineRoute({
      path: "/",
      component: WorkerPage,
      getProps(context) {
        return {
          requestHost: String(context.state.requestHost ?? context.url.host),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          runtimeLabel: String(context.state.runtimeLabel ?? "Unknown runtime"),
        };
      },
      head: {
        title: "Home",
        meta: [
          { property: "og:title", content: "Cloudflare Worker Home" },
          {
            property: "og:description",
            content: "The same app definition running through the Cloudflare adapter.",
          },
        ],
      },
    }),
    defineRoute({
      path: "/deploy",
      component: DeployPage,
      getProps(context) {
        return {
          requestHost: String(context.state.requestHost ?? context.url.host),
          runtimeLabel: String(context.state.runtimeLabel ?? "Unknown runtime"),
        };
      },
      head: {
        title: "Deploy",
        meta: [
          { property: "og:title", content: "Cloudflare Worker Deployment Notes" },
          {
            property: "og:description",
            content: "Why a fetch-compatible app model maps cleanly onto edge runtimes.",
          },
        ],
        stylesheets: ["/styles/deploy.css"],
      },
    }),
  ],
});
