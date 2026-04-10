import { launchWeekStory, socialCardTemplate } from "./data/social-story";
import LaunchWeekCardRoute from "./routes/LaunchWeekCardRoute.vue";
import LaunchWeekStoryRoute from "./routes/LaunchWeekStoryRoute";
import StudioOverviewRoute from "./routes/StudioOverviewRoute.vue";
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
    title: "Social Cards Studio",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#2c1f34">',
    meta: [
      {
        name: "description",
        content:
          "A publisher-oriented example showing how to author dynamic social cards as Vue SFCs and render them with Chromium.",
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
      component: StudioOverviewRoute,
      head: {
        title: "Overview",
        meta: [
          { property: "og:title", content: "Social Cards Studio Overview" },
          {
            property: "og:description",
            content:
              "Why publisher and marketing teams may want dynamic social cards authored in the same Vue codebase as the page.",
          },
        ],
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/stories/launch-week",
      component: LaunchWeekStoryRoute,
      getProps() {
        return launchWeekStory;
      },
      head(context, props) {
        const imageUrl = new URL("/cards/launch-week.png", context.url).href;

        return {
          title: "Launch Week Story",
          meta: [
            { property: "og:title", content: props.title },
            { property: "og:type", content: "article" },
            { property: "og:description", content: props.summary },
            { property: "og:image", content: imageUrl },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:image", content: imageUrl },
          ],
        };
      },
      render: { strategy: "ssg" },
    }),
    defineImageRoute({
      path: "/cards/launch-week.png",
      component: LaunchWeekCardRoute,
      getProps() {
        return socialCardTemplate;
      },
      head: {
        stylesheets: ["/styles/og.css"],
      },
      image: {
        width: 1200,
        height: 630,
      },
    }),
  ],
});
