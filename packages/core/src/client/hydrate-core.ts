import type { Component } from "vue";
import type { AnyDefinedIsland, HydrationStrategy, JsonObject } from "../runtime/types.js";

const RESUME_EVENT_TYPES = ["click", "submit"] as const;
const CLICK_RESUME_TARGET_SELECTOR = [
  "button",
  'input[type="button"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="reset"]',
  'input[type="submit"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
].join(",");

export interface IslandClientApp {
  mount(container: Element | string): unknown;
}

export type CreateIslandClientApp = (component: Component, props: JsonObject) => IslandClientApp;

export async function hydrateIslandsWith(
  islands: readonly AnyDefinedIsland[],
  createApp: CreateIslandClientApp,
): Promise<void> {
  const registry = new Map(
    islands
      .map((island) => island.__vuerendIsland)
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
      let disposeInteractionReplay: (() => void) | undefined;
      let mountPromise: Promise<void> | undefined;

      const mount = () => {
        if (node.dataset.vsMounted === "true") {
          return Promise.resolve();
        }

        mountPromise ??= (async () => {
          const loaded = await definition.load();
          const component = resolveLoadedComponent(loaded);
          createApp(component, props).mount(node);
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
    node.addEventListener(type, listener, { capture: true });
  }

  return () => {
    for (const type of RESUME_EVENT_TYPES) {
      node.removeEventListener(type, listener, { capture: true });
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
  if (event instanceof MouseEvent) {
    return new MouseEvent(event.type, {
      altKey: event.altKey,
      bubbles: event.bubbles,
      button: event.button,
      buttons: event.buttons,
      cancelable: event.cancelable,
      clientX: event.clientX,
      clientY: event.clientY,
      composed: event.composed,
      ctrlKey: event.ctrlKey,
      detail: event.detail,
      metaKey: event.metaKey,
      screenX: event.screenX,
      screenY: event.screenY,
      shiftKey: event.shiftKey,
    });
  }

  if (typeof SubmitEvent === "function" && event instanceof SubmitEvent) {
    return new SubmitEvent(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed,
      submitter: event.submitter,
    });
  }

  return new Event(event.type, {
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed,
  });
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
