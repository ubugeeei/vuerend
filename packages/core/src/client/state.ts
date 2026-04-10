import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
  type WatchStopHandle,
} from "vue";
import type { JsonValue } from "../runtime/types.js";

type ClientStateStorageKind = "local" | "session";

const DEFAULT_NAMESPACE = "vue-server:client-state:";

interface NormalizedUseClientStateOptions {
  namespace: string;
  storage: ClientStateStorageKind | false;
}

interface ClientStateEntry<T extends JsonValue = JsonValue> {
  consumerCount: number;
  initialValue: T;
  loadedFromStorage: boolean;
  options: NormalizedUseClientStateOptions;
  state: Ref<T>;
  storageKey: string;
  stopPersistence: WatchStopHandle | undefined;
  stopStorageSync: (() => void) | undefined;
}

/** Controls how `useClientState()` persists values between page loads. */
export interface UseClientStateOptions {
  namespace?: string;
  storage?: ClientStateStorageKind | false;
}

interface ClientStateInternals {
  activateClientStateEntry<T extends JsonValue>(entry: ClientStateEntry<T>): void;
  clearClientStateRegistry(): void;
  deactivateClientStateEntry(entry: ClientStateEntry): void;
  getClientStateEntry<T extends JsonValue>(
    key: string,
    initialValue: T,
    options: UseClientStateOptions,
  ): ClientStateEntry<T>;
  readStoredClientState<T extends JsonValue>(storage: Storage, key: string): T | undefined;
  resolveClientStateStorage(options: NormalizedUseClientStateOptions): Storage | undefined;
  writeStoredClientState<T extends JsonValue>(storage: Storage, key: string, value: T): void;
}

const registry = new Map<string, ClientStateEntry<JsonValue>>();

/**
 * Shares JSON state across hydrated islands and persists it between MPA page loads.
 *
 * The store is browser-only: during SSR the composable returns a fresh local ref
 * so server renders stay request-scoped and leak-free.
 */
export function useClientState<T extends JsonValue>(
  key: string,
  initialValue: T | (() => T),
  options: UseClientStateOptions = {},
): Ref<T> {
  const resolvedInitial = resolveInitialValue(initialValue);

  if (!isBrowserEnvironment()) {
    return ref(cloneJsonValue(resolvedInitial)) as Ref<T>;
  }

  const entry = getClientStateEntry(key, resolvedInitial, options);
  const instance = getCurrentInstance();

  if (instance) {
    onMounted(() => {
      activateClientStateEntry(entry);
    });

    onBeforeUnmount(() => {
      deactivateClientStateEntry(entry);
    });
  }

  return entry.state as Ref<T>;
}

function getClientStateEntry<T extends JsonValue>(
  key: string,
  initialValue: T,
  options: UseClientStateOptions,
): ClientStateEntry<T> {
  const normalized = normalizeUseClientStateOptions(options);
  const registryKey = createRegistryKey(key, normalized);
  const cached = registry.get(registryKey);

  if (cached) {
    return cached as ClientStateEntry<T>;
  }

  const created: ClientStateEntry<T> = {
    consumerCount: 0,
    initialValue: cloneJsonValue(initialValue),
    loadedFromStorage: false,
    options: normalized,
    state: ref(cloneJsonValue(initialValue)) as Ref<T>,
    storageKey: `${normalized.namespace}${key}`,
    stopPersistence: undefined,
    stopStorageSync: undefined,
  };

  registry.set(registryKey, created as ClientStateEntry<JsonValue>);
  return created;
}

function activateClientStateEntry<T extends JsonValue>(entry: ClientStateEntry<T>): void {
  entry.consumerCount += 1;

  if (entry.consumerCount !== 1) {
    return;
  }

  hydrateClientStateEntry(entry);

  const storage = resolveClientStateStorage(entry.options);

  if (!storage) {
    return;
  }

  entry.stopPersistence = watch(
    entry.state,
    (value) => {
      writeStoredClientState(storage, entry.storageKey, value);
    },
    {
      deep: true,
    },
  );
  entry.stopStorageSync = subscribeToStorageEvents(entry, storage);
}

function deactivateClientStateEntry(entry: ClientStateEntry): void {
  entry.consumerCount = Math.max(0, entry.consumerCount - 1);

  if (entry.consumerCount > 0) {
    return;
  }

  entry.stopPersistence?.();
  entry.stopStorageSync?.();
  entry.stopPersistence = undefined;
  entry.stopStorageSync = undefined;
}

function hydrateClientStateEntry<T extends JsonValue>(entry: ClientStateEntry<T>): void {
  if (entry.loadedFromStorage) {
    return;
  }

  entry.loadedFromStorage = true;

  const storage = resolveClientStateStorage(entry.options);

  if (!storage) {
    return;
  }

  const stored = readStoredClientState<T>(storage, entry.storageKey);

  if (stored !== undefined) {
    entry.state.value = stored;
  }
}

function subscribeToStorageEvents<T extends JsonValue>(
  entry: ClientStateEntry<T>,
  storage: Storage,
): () => void {
  const listener = (event: StorageEvent) => {
    if (event.storageArea !== storage || event.key !== entry.storageKey) {
      return;
    }

    if (event.newValue === null) {
      entry.state.value = cloneJsonValue(entry.initialValue);
      return;
    }

    try {
      entry.state.value = JSON.parse(event.newValue) as T;
    } catch {
      entry.state.value = cloneJsonValue(entry.initialValue);
    }
  };

  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("storage", listener);
  };
}

function normalizeUseClientStateOptions(
  options: UseClientStateOptions,
): NormalizedUseClientStateOptions {
  return {
    namespace: options.namespace ?? DEFAULT_NAMESPACE,
    storage: options.storage ?? "session",
  };
}

function resolveClientStateStorage(options: NormalizedUseClientStateOptions): Storage | undefined {
  if (!isBrowserEnvironment() || options.storage === false) {
    return undefined;
  }

  try {
    return options.storage === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

function readStoredClientState<T extends JsonValue>(
  storage: Storage,
  key: string,
): T | undefined {
  const raw = storage.getItem(key);

  if (raw === null) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function writeStoredClientState<T extends JsonValue>(
  storage: Storage,
  key: string,
  value: T,
): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and serialization failures to keep the composable non-fatal.
  }
}

function resolveInitialValue<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

function createRegistryKey(key: string, options: NormalizedUseClientStateOptions): string {
  return `${options.namespace}|${options.storage}|${key}`;
}

function isBrowserEnvironment(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function cloneJsonValue<T extends JsonValue>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export const __clientStateInternals: ClientStateInternals = {
  activateClientStateEntry: activateClientStateEntry,
  clearClientStateRegistry() {
    registry.clear();
  },
  deactivateClientStateEntry: deactivateClientStateEntry,
  getClientStateEntry: getClientStateEntry,
  readStoredClientState: readStoredClientState,
  resolveClientStateStorage: resolveClientStateStorage,
  writeStoredClientState: writeStoredClientState,
};
