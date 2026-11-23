<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>

  <ContentBlock>
    <h1>Features</h1>
    <p>
      Prefer videos? Watch short demos on the
      <a href="/videos.html">Demos</a> page.
    </p>
    <p class="note">
      Screenshots are from the CCF demo environment: a fictional bank, Meridian Financial Group,
      with ten systems and live evidence from GitHub and Kubernetes.
    </p>
  </ContentBlock>

  <ContentBlock>
    <h2> Live Compliance Snapshots </h2>
    <h3> Stay ready for audit </h3>
    <p>
      Agents and plugins collect evidence continuously from GitHub, Kubernetes, PAM tools and more.
      Every check is labelled, so you can search across all of it, watch compliance over time and
      keep an eye on agent health.
    </p>
    <img src="/img/features/evidence.png" alt="Evidence page filtered by the label provider=github, with compliance-over-time and agent-health charts above a list of passing and failing checks" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Evidence You Can Trust </h2>
    <h3> Signed, dated and kept </h3>
    <p>
      Each piece of evidence says what it checks and why it passed or failed. It is signed when it is
      collected, carries an expiry date and keeps its history, and a failure can raise risks and tasks.
    </p>
    <img src="/img/features/evidence-detail.png" alt="A failing GitHub check, marked not satisfied and signed, with its description, collection and expiry dates, and tabs for metadata, risks, signature and history" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Compliance for Every System </h2>
    <h3> One System Security Plan per system </h3>
    <p>
      Each system has its own System Security Plan, with the control profiles that apply to it.
      See at a glance which controls are satisfied, which aren't, and what has still to be implemented.
    </p>
    <img src="/img/features/compliance.png" alt="Compliance page for the Customer Portal system: satisfied, not satisfied and unknown counts, compliance and implementation progress bars, and the status of each control" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Trace Standards to Evidence </h2>
    <h3> From policy to proof </h3>
    <p>
      The compliance map links your corporate standards, policies and internal controls, and rolls
      compliance and open risk up from the evidence. Drill down from a standard to the check that is
      failing, or open a control to see where it stands on every system.
    </p>
    <img src="/img/features/compliance-map.png" alt="Compliance map tree drilled down from a delivery and resilience policy to an availability-zone control and the risks linked to it, with compliance percentages and risk scores on each row" class="screenshot" loading="lazy" />
    <img src="/img/features/control-status.png" alt="One control across all ten systems: 71% compliant, with each system marked satisfied, not satisfied or out of scope" class="screenshot screenshot-narrow" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> A Risk Register That Follows the Evidence </h2>
    <h3> See risk as it changes </h3>
    <p>
      Failing evidence feeds a risk register for each system. Track risks by status and severity,
      review them on a deadline, accept them with a justification, or promote them to a POA&amp;M.
    </p>
    <img src="/img/features/risks.png" alt="Risk dashboard for the Customer Portal: risks by status and a likelihood-by-impact heatmap" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Workflows for People, Too </h2>
    <h3> Evidence from human processes </h3>
    <p>
      Not every control can be checked by a machine. Schedule recurring processes such as access
      reviews and disaster-recovery exercises, assign each step to a role, and record every completed
      step as evidence.
    </p>
    <img src="/img/features/workflows.png" alt="Workflow instances: quarterly access reviews and annual disaster-recovery exercises, each with a cadence and status" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Policy-as-Code Validation </h2>
    <h3> Shift left with confidence </h3>
    <p> Use Rego to enforce custom compliance rules directly from source to production.  </p>
    <img src="/img/ccf-rego.png" alt="A Rego policy that flags SSH servers allowing password authentication" class="w-full max-w-3xl mx-auto my-8" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Works With Any Framework </h2>
    <h3> Can flex to any catalog you need </h3>
    <p>
      Run your control regime against any catalog: NIST, SOC 2, PCI DSS, ISO, or your own internal
      catalogs. Catalogs are OSCAL, so you can import a published one or write your own, like this
      corporate standard.
    </p>
    <img src="/img/features/catalog.png" alt="A corporate security standard catalog with its identity and resilience control groups opened to show their controls" class="screenshot" loading="lazy" />
  </ContentBlock>

  <ContentBlock>
    <h2> Integrate Anywhere </h2>
    <h3> Track and apply policy to whatever you can communicate with </h3>
    <p> Drop CCF agents into your environment and connect via plugins — no vendor lock-in, just clean, scalable data collection.  </p>
    <img src="/img/ccf-plugins-github.png" alt="CCF plugin repositories on GitHub" class="w-full max-w-3xl mx-auto my-8" loading="lazy" />
  </ContentBlock>

</template>

<style scoped>
.note {
  font-size: 0.9rem;
  opacity: 0.75;
}

/* App screenshots: framed so their light background stands apart from the page. */
.screenshot {
  display: block;
  width: 100%;
  max-width: 48rem;
  margin: 2rem auto;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
}

.screenshot-narrow {
  max-width: 38rem;
}

/* Vue scopes only the last selector, so the theme ancestor still matches. */
[data-theme="dark"] .screenshot {
  border-color: rgb(255 255 255 / 0.15);
}
</style>
