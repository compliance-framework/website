<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>
  <ContentBlock>
    <h1>Pricing</h1>
    <p>
      Start free and scale with your team. Self-host or get enterprise support.
    </p>
  </ContentBlock>

  <ContentBlock>
    <div class="pricing-grid">
      <div class="card">
        <div class="card-header">
          <h3>Open Source</h3>
          <div class="price">Free</div>
        </div>
        <p>All core features. Self-hosted.</p>
        <ul class="features">
          <li>Policy-as-code checks</li>
          <li>Dashboards and findings</li>
          <li>Plugin/agent framework</li>
          <li>Community support</li>
        </ul>
        <div class="actions">
          <a class="button" href="https://github.com/ContainerSolutions/compliance-framework" target="_blank" rel="noopener">Get on GitHub</a>
        </div>
      </div>

      <div class="card highlighted">
        <div class="card-header">
          <h3>Team</h3>
          <div class="price">Contact us</div>
        </div>
        <p>Support for teams adopting CCF.</p>
        <ul class="features">
          <li>Priority troubleshooting</li>
          <li>Guided onboarding</li>
          <li>Best-practice templates</li>
          <li>SLAs</li>
        </ul>
        <div class="actions">
          <a class="button primary" href="mailto:hello@container-solutions.com">Talk to us</a>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Enterprise</h3>
          <div class="price">Custom</div>
        </div>
        <p>Tailored services and integrations.</p>
        <ul class="features">
          <li>Architecture reviews</li>
          <li>Custom controls & mappings</li>
          <li>Private plugins</li>
          <li>Dedicated support</li>
        </ul>
        <div class="actions">
          <a class="button" href="mailto:hello@container-solutions.com">Contact sales</a>
        </div>
      </div>
    </div>
  </ContentBlock>
</template>

<style scoped>
.pricing-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
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
