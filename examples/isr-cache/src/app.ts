import LandingPage from "./pages/LandingPage";
import PostPage from "./pages/PostPage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: LandingPage,
      getProps() {
        return {
          now: new Date().toISOString(),
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

        return {
          slug,
        };
      },
      prerender: ["/posts/hello", "/posts/world"],
      render: {
        strategy: "ssg",
      },
    }),
  ],
});
