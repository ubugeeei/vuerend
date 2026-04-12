import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { createRequestHandler, defineApp, defineIsland, defineRoute } from "../src/runtime";

describe("islands", () => {
  it("keeps regular route components server-only by default", async () => {
    const HomePage = defineComponent({
      setup() {
        return () => h("main", [h("h1", "server only")]);
      },
    });

    const handler = createRequestHandler({
      app: defineApp({
        routes: [defineRoute({ path: "/", component: HomePage })],
      }),
      assets: {
        entry: "/assets/vuerend-client.js",
      },
    });

    const response = await handler(new Request("https://example.test/"));
    const html = await response.text();

    expect(html).toContain("server only");
    expect(html).not.toContain("/assets/vuerend-client.js");
  });

  it("renders explicit island boundaries and injects the client entry", async () => {
    const CounterView = defineComponent({
      props: {
        count: {
          required: true,
          type: Number,
        },
      },
      setup(props) {
        return () => h("button", { type: "button" }, `count:${props.count}`);
      },
    });

    const CounterIsland = defineIsland<{ count: number }>("counter", {
      load: async () => ({ default: CounterView }),
      hydrate: "visible",
    });

    const HomePage = defineComponent({
      setup() {
        return () => h("main", [h("h1", "hello"), h(CounterIsland, { count: 2 })]);
      },
    });

    const handler = createRequestHandler({
      app: defineApp({
        routes: [defineRoute({ path: "/", component: HomePage })],
      }),
      assets: {
        entry: "/assets/vuerend-client.js",
        modulepreload: ["/assets/vue.js"],
      },
    });

    const response = await handler(new Request("https://example.test/"));
    const html = await response.text();

    expect(html).toContain('data-vs-component="counter"');
    expect(html).toContain('data-vs-hydrate="visible"');
    expect(html).toContain("count:2");
    expect(html).toContain('rel="modulepreload" href="/assets/vue.js"');
    expect(html).toContain("/assets/vuerend-client.js");
  });

  it("rejects using an island as the route component", async () => {
    const CounterView = defineComponent({
      setup() {
        return () => h("button", { type: "button" }, "count:2");
      },
    });
    const CounterIsland = defineIsland("counter", {
      component: CounterView,
      load: async () => ({ default: CounterView }),
    });
    const handler = createRequestHandler({
      app: defineApp({
        routes: [defineRoute({ path: "/", component: CounterIsland as never })],
      }),
    });

    await expect(handler(new Request("https://example.test/"))).rejects.toThrow(
      'Route "/" cannot use island "counter" as its page component.',
    );
  });
});
