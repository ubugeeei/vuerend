import * as Vue from "vue";
import type { App } from "vue";

interface VueVaporRuntime {
  vaporInteropPlugin?: unknown;
}

export function installVaporInterop(app: App): void {
  const { vaporInteropPlugin } = Vue as typeof Vue & VueVaporRuntime;

  if (!vaporInteropPlugin) {
    throw new TypeError("Vuerend vapor rendering requires Vue 3.6+ with vaporInteropPlugin.");
  }

  app.use(vaporInteropPlugin as never);
}
