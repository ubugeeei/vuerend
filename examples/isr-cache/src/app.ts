import { releaseNoteList, releaseNotes } from "./data/release-notes";
import ReleaseNotesHomeRoute from "./routes/ReleaseNotesHomeRoute";
import ReleaseNoteRoute from "./routes/ReleaseNoteRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Release Notes Studio",
    titleTemplate: "%s | Vuerend",
    head: '<meta name="theme-color" content="#143321">',
    meta: [
      {
        name: "description",
        content: "A release notes site with an ISR landing page and fully prerendered entry pages.",
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
      component: ReleaseNotesHomeRoute,
      getProps() {
        return {
          now: new Date().toISOString(),
          posts: releaseNoteList,
        };
      },
      head(context, props) {
        return {
          title: "Landing",
          meta: [
            {
              property: "og:title",
              content: "Release Notes Landing Page",
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
              content: `Fresh release notes HTML rendered at ${props.now}.`,
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
      component: ReleaseNoteRoute,
      getProps(context) {
        const slug = context.params.slug;

        if (!slug) {
          throw new TypeError("missing slug");
        }

        const post = releaseNotes[slug as keyof typeof releaseNotes];

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
      prerender: Object.keys(releaseNotes).map((slug) => `/posts/${slug}`),
      render: {
        strategy: "ssg",
      },
    }),
  ],
});
