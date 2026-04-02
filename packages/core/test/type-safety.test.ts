import { defineComponent } from "vue";
import { describe, expectTypeOf, it } from "vitest";
import { defineIsland, defineRoute } from "../src/runtime";

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
});
