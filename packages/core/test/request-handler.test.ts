import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { createRequestHandler, defineApp, defineRoute } from "../src/runtime";

describe("createRequestHandler", () => {
  it("renders explicit routes and passes route params into props", async () => {
    const PostPage = defineComponent({
      props: {
        slug: {
          required: true,
          type: String,
        },
      },
      setup(props) {
        return () => h("article", { "data-slug": props.slug }, props.slug);
      },
    });

    const handler = createRequestHandler({
      app: defineApp({
        routes: [
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
          }),
        ],
      }),
    });

    const response = await handler(new Request("https://example.test/posts/hello-world"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("hello-world");
    expect(html).toContain('data-slug="hello-world"');
  });
});
