import { vaporInteropPlugin } from "@vue/runtime-vapor";
import type { App } from "vue";

export function installVaporInterop(app: App): void {
  if (!vaporInteropPlugin) {
    throw new TypeError("Vuerend vapor rendering requires @vue/runtime-vapor.");
  }

  app.use(vaporInteropPlugin as never);
}
