<template>
  <div>
    <Header />
    <List />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import List from "@/components/List.vue";

export default defineComponent({
  name: "Home",
  components: {
    Header,
    List
  }
});
</script>
