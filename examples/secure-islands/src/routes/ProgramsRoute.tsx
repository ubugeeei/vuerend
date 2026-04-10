import { defineComponent } from "vue";
import { launchPrograms } from "../data/launch-week";

export default defineComponent({
  name: "ProgramsRoute",
  setup() {
    return () => (
      <main class="secure-shell secure-shell--pricing">
        <section class="pricing-hero">
          <div>
            <p class="eyebrow">Server-only companion page</p>
            <h1>Programs page without hydration</h1>
            <p class="lede">
              This page lives in the same launch app, but it renders no islands at all. That means
              it stays a plain server-rendered page with zero client hydration.
            </p>
          </div>
          <a class="primary-link" href="/">
            Back to Launch Site
          </a>
        </section>

        <section class="pricing-grid">
          {launchPrograms.map((program) => (
            <article
              class={["pricing-card", program.featured ? "pricing-card--featured" : ""]}
              key={program.title}
            >
              <h2>{program.title}</h2>
              <p class="price-tag">
                {program.price}
                {program.suffix ? <span>{program.suffix}</span> : null}
              </p>
              <ul class="feature-list">
                {program.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
