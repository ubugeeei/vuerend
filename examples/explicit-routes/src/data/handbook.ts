export interface HandbookFeature {
  body: string;
  title: string;
}

export const handbookHeroPoints = [
  "Policy sites and handbooks rarely need a client router.",
  "Zero JavaScript can stay the default for whole documents.",
  "Metadata and styles stay close to each explicit route.",
  "Dynamic social cards can still be authored as Vue SFCs.",
] as const;

export const handbookFeatureCards: HandbookFeature[] = [
  {
    title: "Visible route table",
    body: "Every handbook page is declared in one place, which keeps the publishing surface easy to audit.",
  },
  {
    title: "Shared document defaults",
    body: "Typography, metadata defaults, and stylesheets live at the app layer while each route can add its own head data.",
  },
  {
    title: "Static by default",
    body: 'This example leans on `strategy: "ssg"` because most handbook pages change on editorial timelines, not per request.',
  },
] as const;

export const handbookGoodFits = [
  "Onboarding guides and policy handbooks",
  "Documentation hubs with a small route surface",
  "Release notes and changelog archives",
  "Apps that want documents first and islands second",
] as const;

export const handbookPrinciples: HandbookFeature[] = [
  {
    title: "Route and metadata together",
    body: "Titles, Open Graph tags, cache policy, and the page component all live in the same route definition.",
  },
  {
    title: "Normal document navigation",
    body: "Anchors move between pages. If a route does not need an island, it does not hydrate any client code.",
  },
  {
    title: "Small deployment surface",
    body: "The same route model can later pick up middleware, caching, or alternate runtimes without changing how the pages are authored.",
  },
] as const;

export const handbookSocialCard = {
  eyebrow: "Handbook snapshot",
  title: "Team Handbook",
  description: "Onboarding, policy, and release guidance published as Vue pages and social cards.",
} as const;
