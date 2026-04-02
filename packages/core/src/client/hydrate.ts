import { createSSRApp, type Component } from "vue";
import { getIslandDefinition } from "../runtime/islands.js";
import type { AnyDefinedIsland, HydrationStrategy, JsonObject } from "../runtime/types.js";

/**
 * Hydrates every island instance found in the current document.
 *
 * This function is intended to be called from the generated client entry.
 */
export async function hydrateIslands(islands: readonly AnyDefinedIsland[]): Promise<void> {
  const registry = new Map(
    islands
      .map((island) => getIslandDefinition(island))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .map((entry) => [entry.id, entry]),
  );

  const nodes = document.querySelectorAll<HTMLElement>("[data-vs-island][data-vs-component]");

  await Promise.all(
    [...nodes].map(async (node) => {
      const id = node.dataset.vsComponent;
      const instanceId = node.dataset.vsIsland;

      if (!id || !instanceId) {
        return;
      }

      const definition = registry.get(id);

      if (!definition) {
        return;
      }

      const propsNode = document.querySelector<HTMLScriptElement>(
        `script[data-vs-island-props="${CSS.escape(instanceId)}"]`,
      );
      const props = parseProps(propsNode?.textContent ?? "{}");
      const hydrate = (node.dataset.vsHydrate as HydrationStrategy | undefined) ?? "load";
      const media = node.dataset.vsMedia;

      await scheduleHydration(node, hydrate, media, async () => {
        if (node.dataset.vsMounted === "true") {
          return;
        }

        const loaded = await definition.load();
        const component = resolveLoadedComponent(loaded);
        createSSRApp(component, props).mount(node);
        node.dataset.vsMounted = "true";
      });
    }),
  );
}

function parseProps(value: string): JsonObject {
  return JSON.parse(value) as JsonObject;
}

function resolveLoadedComponent(loaded: unknown): Component {
  if (loaded && typeof loaded === "object" && "default" in loaded) {
    return (loaded as { default: Component }).default;
  }

  return loaded as Component;
}

async function scheduleHydration(
  node: HTMLElement,
  strategy: HydrationStrategy,
  media: string | undefined,
  mount: () => Promise<void>,
): Promise<void> {
  switch (strategy) {
    case "idle": {
      await waitForIdle();
      return mount();
    }

    case "visible": {
      await waitForVisibility(node);
      return mount();
    }

    case "media": {
      await waitForMedia(media);
      return mount();
    }

    case "load":
    default:
      return mount();
  }
}

function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => resolve());
      return;
    }

    globalThis.setTimeout(() => resolve(), 1);
  });
}

function waitForVisibility(node: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (!("IntersectionObserver" in window)) {
      resolve();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(node);
  });
}

function waitForMedia(query: string | undefined): Promise<void> {
  return new Promise((resolve) => {
    if (!query) {
      resolve();
      return;
    }

    const media = window.matchMedia(query);

    if (media.matches) {
      resolve();
      return;
    }

    const listener = () => {
      media.removeEventListener("change", listener);
      resolve();
    };

    media.addEventListener("change", listener);
  });
}
