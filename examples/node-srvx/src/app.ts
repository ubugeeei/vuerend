import HomePage from "./pages/HomePage";
import MiddlewarePage from "./pages/MiddlewarePage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  document: {
    title: "srvx Node",
    titleTemplate: "%s | Vue Server",
    head: '<meta name="theme-color" content="#2d233c">',
    meta: [
      {
        name: "description",
        content: "Node adapter example with middleware and request-scoped state.",
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
      context.state.requestMethod = request.method;
      context.state.requestStartedAt = new Date().toISOString();
      const response = await next();
      response.headers.set("x-powered-by", "vue-server");
      return response;
    },
  ],
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      getProps(context) {
        return {
          requestMethod: String(context.state.requestMethod ?? context.request.method),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          requestStartedAt: String(context.state.requestStartedAt ?? ""),
        };
      },
      head: {
        title: "Home",
        meta: [
          { property: "og:title", content: "srvx Node Home" },
          {
            property: "og:description",
            content: "A Node server entry using middleware and request-scoped state.",
          },
        ],
      },
    }),
    defineRoute({
      path: "/middleware",
      component: MiddlewarePage,
      getProps(context) {
        return {
          requestMethod: String(context.state.requestMethod ?? context.request.method),
          requestPath: String(context.state.requestPath ?? context.url.pathname),
          requestStartedAt: String(context.state.requestStartedAt ?? ""),
        };
      },
      head: {
        title: "Middleware",
        meta: [
          { property: "og:title", content: "srvx Node Middleware Flow" },
          {
            property: "og:description",
            content: "How middleware feeds request-scoped data into server-rendered routes.",
          },
        ],
        stylesheets: ["/styles/middleware.css"],
      },
    }),
  ],
});
