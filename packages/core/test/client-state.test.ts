import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { useClientState } from "../src/client";
import { __clientStateInternals } from "../src/client/state";

describe("useClientState", () => {
  afterEach(() => {
    __clientStateInternals.clearClientStateRegistry();
    vi.unstubAllGlobals();
  });

  it("returns request-local refs during SSR", () => {
    const first = useClientState<number>("shared-count", 0);
    const second = useClientState<number>("shared-count", 0);

    first.value += 1;

    expect(first).not.toBe(second);
    expect(second.value).toBe(0);
  });

  it("shares browser state and persists it to sessionStorage", async () => {
    const browser = createBrowserMock();
    vi.stubGlobal("window", browser.window);
    vi.stubGlobal("document", {});

    const state = useClientState<number>("reading-list", 0);
    const sameState = useClientState<number>("reading-list", 99);
    const entry = __clientStateInternals.getClientStateEntry<number>("reading-list", 0, {});

    __clientStateInternals.activateClientStateEntry(entry);

    expect(state).toBe(sameState);

    state.value = 3;
    await nextTick();

    expect(browser.sessionStorage.getItem("vue-server:client-state:reading-list")).toBe("3");

    browser.dispatchStorageEvent({
      key: "vue-server:client-state:reading-list",
      newValue: "7",
      storageArea: browser.sessionStorage,
    });

    expect(state.value).toBe(7);

    __clientStateInternals.deactivateClientStateEntry(entry);
  });
});

function createBrowserMock() {
  const listeners = new Set<(event: StorageEvent) => void>();
  const sessionStorage = createStorageMock();
  const localStorage = createStorageMock();

  return {
    localStorage,
    sessionStorage,
    window: {
      addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        if (type !== "storage") {
          return;
        }

        listeners.add(listener as (event: StorageEvent) => void);
      },
      localStorage,
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        if (type !== "storage") {
          return;
        }

        listeners.delete(listener as (event: StorageEvent) => void);
      },
      sessionStorage,
    },
    dispatchStorageEvent(event: Pick<StorageEvent, "key" | "newValue" | "storageArea">) {
      for (const listener of listeners) {
        listener(event as StorageEvent);
      }
    },
  };
}

function createStorageMock(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}
