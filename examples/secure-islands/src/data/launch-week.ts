export const launchHighlights = [
  "The workshop seat estimator hydrates only when it becomes visible.",
  "The concierge signup mounts on idle as a client-only island.",
  "The rest of the site stays document-first and MPA-style.",
] as const;

export const launchStoryCards = [
  {
    title: "Why explicit islands?",
    body: "Launch pages usually need a calculator, scheduler, or form, not a full client router and a hydrated shell around every section.",
  },
  {
    title: "What this example is proving",
    body: "Vuerend keeps Vue as the authoring model for campaign pages while making islands the exception instead of the baseline.",
  },
  {
    title: "What remains static?",
    body: "The hero, social proof, pricing teaser, and FAQ stay plain server-rendered markup. The interactive pieces are the exception.",
  },
] as const;

export const launchProofStrip = [
  {
    label: "0 client router",
    body: "Pages are linked with regular anchors.",
  },
  {
    label: "2 explicit islands",
    body: "Each one has its own hydration strategy.",
  },
  {
    label: "1 launch site",
    body: "Static sections and live widgets can coexist cleanly.",
  },
] as const;

export const launchFaq = [
  {
    title: "Do I lose Vue ergonomics?",
    body: "No. Pages and islands are still Vue components. The only question is where they run and whether they hydrate.",
  },
  {
    title: "Can the rest of the launch site stay static?",
    body: "Yes. The programs route in this example renders no islands at all, so it stays a pure server page even though the launch page supports interactive sections elsewhere.",
  },
] as const;

export const launchPrograms = [
  {
    title: "Preview Room",
    price: "$0",
    suffix: "/event",
    featured: false,
    points: [
      "Single launch page and detail routes",
      "Shared document metadata and app-wide stylesheets",
      "No client bundle unless you opt into islands",
    ],
  },
  {
    title: "Launch Week",
    price: "$149",
    suffix: "/event",
    featured: true,
    points: [
      "Targeted islands for forms, estimators, and widgets",
      "Route-level metadata and social previews",
      "Adapters for multiple fetch-style runtimes",
    ],
  },
  {
    title: "Roadshow",
    price: "Custom",
    suffix: "",
    featured: false,
    points: [
      "Middleware, runtime-specific adapters, and revalidation hooks",
      "Edge and Node deployment options from the same app model",
      "MPA-friendly client state only when an island truly needs it",
    ],
  },
] as const;
