<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>

  <ContentBlock>
    <h1>Features</h1>
  </ContentBlock>

  <ContentBlock>
    <h2> Live Compliance Snapshots </h2>
    <h3> Stay ready for audit </h3>
    <p> Real-time dashboards and labeled findings give you constant visibility into your compliance posture.  </p>
    <img src="/img/evidence-1.png" alt="Evidence dashboard" class="w-full max-w-3xl mx-auto my-8" />
  </ContentBlock>

  <ContentBlock>
    <h2> Policy-as-Code Validation </h2>
    <h3> Shift left with confidence </h3>
    <p> Use Rego to enforce custom compliance rules directly from source to production.  </p>
    <img src="/img/ccf-rego.png" alt="Rego logo" class="w-full max-w-3xl mx-auto my-8" />
  </ContentBlock>

  <ContentBlock>
    <h2> Works With Any Framework </h2>
    <h3> Can flex to any catalog you need </h3>
    <p> Run your control regime against any catalog: NIST, SOC 2, PCI DSS, ISO, or your own internal catalogs.  </p>
    <img src="/img/ccf-catalog-1.png" alt="Catalog" class="w-full max-w-3xl mx-auto my-8" />
  </ContentBlock>

  <ContentBlock>
    <h2> Integrate Anywhere </h2>
    <h3> Track and appy policy to whatever you can communicate with </h3>
    <p> Drop CCF agents into your environment and connect via plugins — no vendor lock-in, just clean, scalable data collection.  </p>
    <img src="/img/ccf-plugins-github.png" alt="Plugin repos" class="w-full max-w-3xl mx-auto my-8" />
  </ContentBlock>

</template>
