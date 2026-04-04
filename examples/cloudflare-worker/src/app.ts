import WorkerPage from "./pages/WorkerPage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: WorkerPage,
    }),
  ],
});
