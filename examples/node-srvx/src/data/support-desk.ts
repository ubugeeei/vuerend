export const supportOverviewCards = [
  {
    title: "Why this example exists",
    body: "Some teams already have deployment, observability, and process management around Node. They want a fetch-compatible Vue rendering layer, not a new full-stack framework contract.",
  },
  {
    title: "What stays simple",
    body: "Routes are still explicit. Pages are still server components by default. The adapter and middleware layer are the only Node-specific pieces.",
  },
] as const;

export const supportTraceCards = [
  {
    title: "Why this is useful",
    body: "Auth, tracing, feature flags, and request-specific headers often belong in middleware. This keeps the route definition focused on rendering instead of request plumbing.",
  },
] as const;
