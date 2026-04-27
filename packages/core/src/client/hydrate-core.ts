import type { Component } from "vue";
import type {
  AnyDefinedIsland,
  Awaitable,
  HydrationStrategy,
  JsonObject,
} from "../runtime/types.js";

const RESUME_EVENT_TYPES = ["click", "submit"] as const;
const RESUME_EVENT_OPTIONS = { capture: true } as const;
const CLICK_RESUME_TARGET_SELECTOR =
  "button,input,select,textarea,[role=button],[role=checkbox],[role=radio],[role=switch]";

export interface IslandClientApp {
  mount(container: Element | string): unknown;
}

export type CreateIslandClientApp = (
  component: Component,
  props: JsonObject,
) => Awaitable<IslandClientApp>;

export async function hydrateIslandsWith(
  islands: readonly AnyDefinedIsland[],
  createApp: CreateIslandClientApp,
): Promise<void> {
  const registry = new Map<string, NonNullable<AnyDefinedIsland["__vuerendIsland"]>>();

  for (const island of islands) {
    const entry = island.__vuerendIsland;

    if (entry) {
      registry.set(entry.id, entry);
    }
  }

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

      const props = JSON.parse(
        document.querySelector<HTMLScriptElement>(
          `script[data-vs-island-props="${CSS.escape(instanceId)}"]`,
        )?.textContent ?? "{}",
      ) as JsonObject;
      const hydrate = (node.dataset.vsHydrate as HydrationStrategy | undefined) ?? "load";
      const media = node.dataset.vsMedia;
      let disposeInteractionReplay: (() => void) | undefined;
      let mountPromise: Promise<void> | undefined;

      const mount = () => {
        if (node.dataset.vsMounted === "true") {
          return Promise.resolve();
        }

        mountPromise ??= (async () => {
          const loaded = await definition.load();
          const component =
            loaded && typeof loaded === "object" && "default" in loaded
              ? (loaded.default as Component)
              : (loaded as Component);
          const app = await createApp(component, props);
          app.mount(node);
          node.dataset.vsMounted = "true";
          disposeInteractionReplay?.();
        })().catch((error: unknown) => {
          mountPromise = undefined;
          throw error;
        });

        return mountPromise;
      };

      disposeInteractionReplay = installInteractionReplay(node, mount);
      await scheduleHydration(node, hydrate, media, mount);
    }),
  );
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
    if (window.requestIdleCallback) {
      window.requestIdleCallback(resolve as () => void);
      return;
    }

    setTimeout(() => resolve(), 1);
  });
}

function waitForVisibility(node: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (!window.IntersectionObserver) {
      resolve();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
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

    media.addEventListener("change", resolve as () => void, { once: true });
  });
}

function installInteractionReplay(node: HTMLElement, mount: () => Promise<void>): () => void {
  let replaying = false;

  const listener = (event: Event) => {
    if (replaying || node.dataset.vsMounted === "true") {
      return;
    }

    const target = resolveReplayTarget(node, event);

    if (!target) {
      return;
    }

    const targetPath = target instanceof Element ? getElementPath(node, target) : undefined;
    event.preventDefault();
    event.stopImmediatePropagation();
    replaying = true;

    void mount()
      .then(() => {
        const replayTarget =
          target instanceof Element && !node.contains(target) && targetPath
            ? (resolveElementPath(node, targetPath) ?? target)
            : target;
        replayInteraction(replayTarget, event);
      })
      .catch((error: unknown) => {
        setTimeout(() => {
          throw error;
        }, 0);
      })
      .finally(() => {
        replaying = false;
      });
  };

  for (const type of RESUME_EVENT_TYPES) {
    node.addEventListener(type, listener, RESUME_EVENT_OPTIONS);
  }

  return () => {
    for (const type of RESUME_EVENT_TYPES) {
      node.removeEventListener(type, listener, RESUME_EVENT_OPTIONS);
    }
  };
}

function replayInteraction(target: EventTarget, event: Event): void {
  if (event.type === "click" && target instanceof HTMLElement) {
    target.click();
    return;
  }

  target.dispatchEvent(cloneEvent(event));
}

function resolveReplayTarget(node: HTMLElement, event: Event): EventTarget | undefined {
  if (event.type === "submit") {
    return event.target instanceof HTMLFormElement && node.contains(event.target)
      ? event.target
      : undefined;
  }

  if (event.type !== "click" || !(event.target instanceof Element)) {
    return undefined;
  }

  const target = event.target.closest(CLICK_RESUME_TARGET_SELECTOR);
  return target && node.contains(target) ? target : undefined;
}

function cloneEvent(event: Event): Event {
  return new (event.constructor as typeof Event)(event.type, event);
}

function getElementPath(root: HTMLElement, target: Element): number[] {
  const path: number[] = [];
  let current: Element | null = target;

  while (current && current !== root) {
    const parent: Element | null = current.parentElement;

    if (!parent) {
      break;
    }

    path.unshift([...parent.children].indexOf(current));
    current = parent;
  }

  return path;
}

function resolveElementPath(root: HTMLElement, path: readonly number[]): Element | undefined {
  let current: Element = root;

  for (const index of path) {
    const child = current.children.item(index);

    if (!child) {
      return undefined;
    }

    current = child;
  }

  return current;
}
