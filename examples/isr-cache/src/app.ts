import LandingPage from "./pages/LandingPage";
import PostPage from "./pages/PostPage";
import { defineApp, defineRoute } from "@vuerend/core";

const posts = {
  hello: {
    slug: "hello",
    summary: "Why a server-first landing page can still feel fresh with ISR.",
    title: "Fresh enough without becoming an SPA",
  },
  world: {
    slug: "world",
    summary: "When prerendered content and on-demand regeneration fit together cleanly.",
    title: "Static routes, dynamic publishing cadence",
  },
} as const;

export default defineApp({
  document: {
    title: "ISR Cache",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#143321">',
    meta: [
      {
        name: "description",
        content: "Incremental static regeneration example with shared CSS and route-aware metadata.",
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
      component: LandingPage,
      getProps() {
        return {
          now: new Date().toISOString(),
          posts: Object.values(posts),
        };
      },
      head(context, props) {
        return {
          title: "Landing",
          meta: [
            {
              property: "og:title",
              content: "ISR Cache Landing Page",
            },
            {
              property: "og:type",
              content: "website",
            },
            {
              property: "og:url",
              content: context.url.href,
            },
            {
              property: "og:description",
              content: `Fresh HTML rendered at ${props.now}.`,
            },
          ],
        };
      },
      render: {
        cache: true,
        strategy: "isr",
        revalidate: 60,
        staleWhileRevalidate: 300,
      },
    }),
    defineRoute({
      path: "/posts/:slug",
      component: PostPage,
      getProps(context) {
        const slug = context.params.slug;

        if (!slug) {
          throw new TypeError("missing slug");
        }

        const post = posts[slug as keyof typeof posts];

        if (!post) {
          throw new TypeError(`unknown slug: ${slug}`);
        }

        return {
          slug: post.slug,
          summary: post.summary,
          title: post.title,
        };
      },
      head(context, props) {
        const title = props.title;

        return {
          title,
          meta: [
            {
              property: "og:title",
              content: title,
            },
            {
              property: "og:type",
              content: "article",
            },
            {
              property: "og:url",
              content: context.url.href,
            },
            {
              property: "og:description",
              content: props.summary,
            },
          ],
          stylesheets: ["/styles/post.css"],
        };
      },
      prerender: Object.keys(posts).map((slug) => `/posts/${slug}`),
      render: {
        strategy: "ssg",
      },
    }),
  ],
});
