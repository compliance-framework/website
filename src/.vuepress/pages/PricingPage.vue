<script setup>
import ContentBlockWide from "../components/ContentBlockWide.vue";
</script>

<template>
  <ContentBlockWide>
    <h1>Pricing</h1>
    <p>
      Start free and scale with your team. Self-host or get enterprise support.
    </p>
    <p>
      Talk to <a class="button" href="mailto:ian.miell@container-solutions.com" target="_blank" rel="noopener">sales</a> for a demo or custom quote.
    </p>
    <div class="pricing-grid">
      <div class="card">
        <div class="card-header">
          <h3>Open Source</h3>
          <div class="price">Free</div>
        </div>
        <p>All core features. Self-hosted.</p>
        <ul class="features">
          <li>Plugin/agent framework</li>
          <li>All public check plugins</li>
          <li>Dashboards and findings</li>
          <li>Community support</li>
        </ul>
        <div class="actions">
          <a class="button" href="https://github.com/compliance-framework" target="_blank" rel="noopener">Get on GitHub</a>
        </div>
      </div>
      <div class="card highlighted">
        <div class="card-header">
          <h3>Team</h3>
          <div class="price">Rates on Request</div>
        </div>
        <p>Support for teams adopting CCF.</p>
        <ul class="features">
          <li>Guided onboarding</li>
          <li>Priority troubleshooting</li>
          <li>Bespoke plugin development</li>
          <li>Best-practice templates</li>
        </ul>
        <div class="actions">
          <a class="button" href="mailto:ian.miell@container-solutions.com">Contact sales</a>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Enterprise</h3>
          <div class="price">From £15,000/year</div>
        </div>
        <p>Tailored services and integrations.</p>
        <ul class="features">
          <li>Enterprise edition</li>
          <li>Curated OSCAL catalogs</li>
          <li>Support and maintenance</li>
          <li>Prioritised feature requests</li>
        </ul>
        <div class="actions">
          <a class="button" href="mailto:ian.miell@container-solutions.com">Contact sales</a>
        </div>
      </div>
    </div>
  </ContentBlockWide>
</template>

<style scoped>
.pricing-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  align-items: stretch;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  padding: 1.25rem;
  background: var(--vp-c-bg);
}

.card.highlighted {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: 600;
}

.features {
  margin: 0.5rem 0 1rem;
  padding-left: 1.1rem;
}

.features li {
  list-style: disc;
  margin: 0.25rem 0;
}

.actions {
  margin-top: 1rem;
}

.button {
  display: inline-block;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
}

.button.primary {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
