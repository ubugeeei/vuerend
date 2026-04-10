import RequestTraceRoute from "./routes/RequestTraceRoute";
import SupportOverviewRoute from "./routes/SupportOverviewRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Support Desk",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#2d233c">',
    meta: [
      {
        name: "description",
        content:
          "An internal-tools example using the Node adapter, middleware, and request-scoped state.",
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
      context.state.requestMethod = request.method;
      context.state.requestStartedAt = new Date().toISOString();
      const response = await next();
      response.headers.set("x-powered-by", "vuerend");
      return response;
    },
  ],
  routes: [
    defineRoute({
      path: "/",
      component: SupportOverviewRoute,
      getProps(context) {
        return {
          requestMethod: String(context.state.requestMethod ?? context.request.method),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          requestStartedAt: String(context.state.requestStartedAt ?? ""),
        };
      },
      head: {
        title: "Support Overview",
        meta: [
          { property: "og:title", content: "Support Desk Overview" },
          {
            property: "og:description",
            content:
              "A Node entry using middleware and request-scoped state for an internal support workflow.",
          },
        ],
      },
    }),
    defineRoute({
      path: "/middleware",
      component: RequestTraceRoute,
      getProps(context) {
        return {
          requestMethod: String(context.state.requestMethod ?? context.request.method),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          requestStartedAt: String(context.state.requestStartedAt ?? ""),
        };
      },
      head: {
        title: "Request Trace",
        meta: [
          { property: "og:title", content: "Support Desk Request Trace" },
          {
            property: "og:description",
            content: "How middleware feeds request-scoped data into an internal-tool route.",
          },
        ],
        stylesheets: ["/styles/middleware.css"],
      },
    }),
  ],
});
