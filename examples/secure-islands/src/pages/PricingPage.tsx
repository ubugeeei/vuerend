import { defineComponent } from "vue";

export default defineComponent({
  name: "PricingPage",
  setup() {
    return () => (
      <main class="secure-shell secure-shell--pricing">
        <section class="pricing-hero">
          <div>
            <p class="eyebrow">Server-only companion page</p>
            <h1>Pricing without hydration</h1>
            <p class="lede">
              This page lives in the same app as the launch page, but it renders no islands at all.
              That means it stays a plain server-rendered page with zero client hydration.
            </p>
          </div>
          <a class="primary-link" href="/">
            Back to Launch Page
          </a>
        </section>

        <section class="pricing-grid">
          <article class="pricing-card">
            <h2>Starter</h2>
            <p class="price-tag">$49<span>/month</span></p>
            <ul class="feature-list">
              <li>Explicit routes for editorial and marketing pages</li>
              <li>Shared document metadata and app-wide stylesheets</li>
              <li>No client bundle unless you opt into islands</li>
            </ul>
          </article>
          <article class="pricing-card pricing-card--featured">
            <h2>Growth</h2>
            <p class="price-tag">$149<span>/month</span></p>
            <ul class="feature-list">
              <li>Targeted islands for forms, calculators, and widgets</li>
              <li>Route-level caching and head metadata</li>
              <li>Adapters for multiple fetch-style runtimes</li>
            </ul>
          </article>
          <article class="pricing-card">
            <h2>Platform</h2>
            <p class="price-tag">Custom</p>
            <ul class="feature-list">
              <li>Middleware, runtime-specific adapters, and revalidation hooks</li>
              <li>Edge and Node deployment options from the same app model</li>
              <li>MPA-friendly client state when an island truly needs it</li>
            </ul>
          </article>
        </section>
      </main>
    );
  },
});
