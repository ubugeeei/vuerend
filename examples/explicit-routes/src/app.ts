import { handbookSocialCard } from "./data/handbook";
import HandbookRationaleRoute from "./routes/HandbookRationaleRoute.vue";
import HandbookSocialCardRoute from "./routes/HandbookSocialCardRoute.vue";
import HandbookHomeRoute from "./routes/HandbookHomeRoute";
import {
  defineApp,
  defineImageRoute,
  defineRequestHandlerOptions,
  defineRoute,
} from "@vuerend/core";
import { createChromiumImageRenderer } from "@vuerend/node";

export const requestHandlerOptions = defineRequestHandlerOptions(() => ({
  imageRenderer: createChromiumImageRenderer(),
}));

export default defineApp({
  document: {
    title: "Team Handbook",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#102033">',
    meta: [
      {
        name: "description",
        content:
          "A Zero JavaScript-first handbook and policy hub with explicit routes, SSG pages, and Vue-authored social cards.",
      },
      {
        property: "og:site_name",
        content: "Vuerend Examples",
      },
    ],
    stylesheets: ["/styles/site.css"],
  },
  routes: [
    defineRoute({
      path: "/",
      component: HandbookHomeRoute,
      head(context) {
        const ogImageUrl = new URL("/og/explicit-routes-home.png", context.url).href;

        return {
          title: "Handbook Home",
          meta: [
            {
              property: "og:title",
              content: "Team Handbook",
            },
            {
              property: "og:type",
              content: "website",
            },
            {
              property: "og:description",
              content:
                "Run onboarding guides, policy pages, and internal docs as plain documents with explicit routes.",
            },
            {
              property: "og:image",
              content: ogImageUrl,
            },
            {
              name: "twitter:card",
              content: "summary_large_image",
            },
            {
              name: "twitter:image",
              content: ogImageUrl,
            },
          ],
        };
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/about",
      component: HandbookRationaleRoute,
      head: {
        title: "Why Explicit Routes",
        meta: [
          {
            property: "og:title",
            content: "Why Explicit Routes Fit Handbooks",
          },
          {
            property: "og:description",
            content:
              "Why visible route tables work well for handbooks, policy hubs, and documentation sites.",
          },
        ],
        stylesheets: ["/styles/about.css"],
      },
    }),
    defineImageRoute({
      path: "/og/explicit-routes-home.png",
      component: HandbookSocialCardRoute,
      getProps() {
        return handbookSocialCard;
      },
      head: {
        stylesheets: ["/styles/og-card.css"],
      },
      image: {
        width: 1200,
        height: 630,
      },
    }),
  ],
});
