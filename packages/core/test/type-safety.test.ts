import { defineComponent } from "vue";
import { describe, expectTypeOf, it } from "vitest";
import { useClientState } from "../src/client";
import { defineApp, defineIsland, defineRoute } from "../src/runtime";

describe("type safety", () => {
  it("infers params from the route path", () => {
    const PostPage = defineComponent({
      props: {
        slug: {
          required: true,
          type: String,
        },
      },
    });

    defineRoute({
      path: "/posts/:slug",
      component: PostPage,
      getProps(context) {
        expectTypeOf(context.params.slug).toEqualTypeOf<string>();

        return {
          slug: context.params.slug,
        };
      },
    });
  });

  it("rejects params that are not declared by the route path", () => {
    const Page = defineComponent({});

    defineRoute({
      path: "/",
      component: Page,
      getProps(context) {
        // @ts-expect-error static routes do not expose named params
        return { slug: context.params.slug };
      },
    });
  });

  it("rejects islands as route components", () => {
    const CounterView = defineComponent({});
    const CounterIsland = defineIsland("counter", {
      component: CounterView,
      load: async () => ({ default: CounterView }),
    });

    defineRoute({
      path: "/",
      // @ts-expect-error routes must render server components, not islands
      component: CounterIsland,
    });
  });

  it("accepts static route head objects", () => {
    const Page = defineComponent({});

    defineRoute({
      path: "/",
      component: Page,
      head: {
        title: "Home",
        meta: [{ property: "og:title", content: "Home Page" }],
        stylesheets: ["/assets/app.css"],
      },
    });
  });

  it("exposes request state inside route hooks", () => {
    const Page = defineComponent({});

    defineRoute({
      path: "/",
      component: Page,
      getProps(context) {
        expectTypeOf(context.state).toEqualTypeOf<Record<string, unknown>>();
        return {};
      },
    });
  });

  it("contextually types middleware definitions", () => {
    const Page = defineComponent({});

    defineApp({
      middleware: [
        async (request, context, next) => {
          expectTypeOf(request).toEqualTypeOf<Request>();
          expectTypeOf(context.state).toEqualTypeOf<Record<string, unknown>>();
          return next();
        },
      ],
      routes: [
        defineRoute({
          path: "/",
          component: Page,
        }),
      ],
    });
  });

  it("infers the client state ref value type", () => {
    const counter = useClientState<number>("counter", 0);
    const profile = useClientState<{ name: string; theme: string }>("profile", {
      name: "Ada",
      theme: "light",
    });

    expectTypeOf(counter.value).toEqualTypeOf<number>();
    expectTypeOf(profile.value).toEqualTypeOf<{
      name: string;
      theme: string;
    }>();
  });
});
