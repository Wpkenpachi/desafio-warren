<template>
  <section class="container is-widescreen">
    <div class="box">
      <Home />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Home from "@/views/Home.vue";
import { mapActions, mapMutations } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    Home
  },
  methods: {
    ...mapActions(["loadState"]),
    ...mapMutations(["updateState"])
  },
  beforeMount() {
    this.loadState();
    this.updateState();
  }
});
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
</style>
