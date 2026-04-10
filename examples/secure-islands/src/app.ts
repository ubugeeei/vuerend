import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  document: {
    title: "Secure Islands",
    titleTemplate: "%s | Vue Server",
    head: '<meta name="theme-color" content="#1d2a4a">',
    meta: [
      {
        name: "description",
        content: "Server-first landing pages with explicit islands and targeted hydration.",
      },
      {
        property: "og:site_name",
        content: "Vue Server Examples",
      },
    ],
    stylesheets: ["/styles/site.css"],
  },
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      head: {
        title: "Launch Page",
        meta: [
          { property: "og:title", content: "Secure Islands Launch Page" },
          {
            property: "og:description",
            content: "A mostly static product page with tiny interactive islands.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/pricing",
      component: PricingPage,
      head: {
        title: "Pricing",
        meta: [
          { property: "og:title", content: "Secure Islands Pricing" },
          {
            property: "og:description",
            content: "A pure server-rendered companion page in the same app.",
          },
        ],
        stylesheets: ["/styles/pricing.css"],
      },
      render: { strategy: "ssg" },
    }),
  ],
});
