<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>
  <ContentBlock>
    <h1 class="!text-3xl">The Continuous Compliance Framework</h1>

    <p>
      The Continuous Compliance Framework (CCF) is an open source, automated compliance testing and reporting system designed
      to help organizations continuously assess their adherence to regulatory standards such as NIST SP 800-53, SOC 2,
      PCI DSS, and GDPR. It integrates policy-based compliance checks, real-time monitoring, and structured reporting to
      streamline and centralise traditionally manual, periodic and disparate audit processes.
    </p>
    <img src="/img/logo-light.svg" alt="CCF Logo" class="w-full max-w-3xl mx-auto my-8 dark:hidden" />
    <img src="/img/logo-dark.svg" alt="CCF Logo" class="w-full max-w-3xl mx-auto my-8 hidden dark:block" />
    <p>
      It's built and maintained by the team at Container Solutions, with contributions from the open source community.
    </p>
  </ContentBlock>


  <ContentBlock>
    <h1>Features</h1>
    <p> See <a href='features.html'>here</a> for features. </p>
  </ContentBlock>

</template>
