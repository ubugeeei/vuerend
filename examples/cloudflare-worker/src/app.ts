import DeploymentRoute from "./routes/DeploymentRoute";
import EdgeOverviewRoute from "./routes/EdgeOverviewRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Edge Status Board",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#142b52">',
    meta: [
      {
        name: "description",
        content:
          "A Cloudflare Worker example showing how the same explicit-route app model ships to the edge.",
      },
      {
        property: "og:site_name",
        content: "Vuerend Examples",
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
      component: EdgeOverviewRoute,
      getProps(context) {
        return {
          requestHost: String(context.state.requestHost ?? context.url.host),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          runtimeLabel: String(context.state.runtimeLabel ?? "Unknown runtime"),
        };
      },
      head: {
        title: "Edge Overview",
        meta: [
          { property: "og:title", content: "Edge Status Board Overview" },
          {
            property: "og:description",
            content:
              "The same app definition running through the Cloudflare adapter for edge delivery.",
          },
        ],
      },
    }),
    defineRoute({
      path: "/deploy",
      component: DeploymentRoute,
      getProps(context) {
        return {
          requestHost: String(context.state.requestHost ?? context.url.host),
          runtimeLabel: String(context.state.runtimeLabel ?? "Unknown runtime"),
        };
      },
      head: {
        title: "Deployment Notes",
        meta: [
          { property: "og:title", content: "Edge Status Board Deployment Notes" },
          {
            property: "og:description",
            content: "Why a fetch-compatible app model maps cleanly onto Cloudflare Workers.",
          },
        ],
        stylesheets: ["/styles/deploy.css"],
      },
    }),
  ],
});
