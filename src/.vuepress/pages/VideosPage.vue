<script setup>
import ContentBlock from "../components/ContentBlock.vue";
</script>

<template>
  <ContentBlock>
    <h1>Demos</h1>
    <p>
      Explore short demos of the Continuous Compliance Framework in action.
    </p>
  </ContentBlock>

  <ContentBlock>
    <h2>Product Walkthroughs</h2>
    <div class="video-grid">

      <div class="video">
        <div class="video-inner">
          <iframe
            src="https://youtube.com/embed/EHdDzrXHWXs"
            title="Mapping Evidence to Controls"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <p class="caption">Mapping Evidence to Controls</p>
      </div>

      <!--<div class="video">
        <div class="video-inner">
          <iframe
            src="https://www.youtube.com/embed/ysz5S6PUM-U"
            title="CCF Overview"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <p class="caption">Overview: What is CCF?</p>
      </div>

      <div class="video">
        <div class="video-inner">
          <iframe
            src="https://www.youtube.com/embed/kPa7bsKwL-c"
            title="Live Compliance Snapshot"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <p class="caption">Live Compliance Snapshot demo</p>
      </div>

      <div class="video">
        <div class="video-inner">
          <iframe
            src="https://www.youtube.com/embed/rUWxSEwctFU"
            title="Policy-as-Code"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <p class="caption">Policy-as-Code with Rego</p>
      </div>
      -->
    </div>
  </ContentBlock>
</template>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.video-inner {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  background: #000;
  border-radius: 0.5rem;
  overflow: hidden;
}

.video-inner iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.caption {
  margin-top: 0.5rem;
  text-align: center;
  opacity: 0.8;
}

</style>
