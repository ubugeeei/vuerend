import WorkerPage from "./pages/WorkerPage";
import { defineApp, defineRoute } from "@vue-server/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: WorkerPage,
    }),
  ],
});
