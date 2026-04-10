export const edgeOverviewCards = [
  {
    title: "Why this example exists",
    body: "If your rendering model assumes a process-bound Node server, edge deployment becomes a separate architecture. Vuerend keeps the app contract fetch-native from the beginning.",
  },
  {
    title: "What stays consistent",
    body: "You still define the app with explicit routes, server components, middleware, and optional islands. Only the outer adapter changes.",
  },
] as const;

export const edgeDeploymentCards = [
  {
    title: "What the adapter buys you",
    body: "The Cloudflare package wraps the same request handler shape used elsewhere. That keeps the route model, metadata, caching policy, and islands story identical across runtimes.",
  },
] as const;
