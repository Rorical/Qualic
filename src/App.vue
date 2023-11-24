<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const menu = ref({
  Home: [
      "Main",
      "Settings"
  ],
  Editor: [
      "Visual",
      "Text"
  ],
});
const selected = ref('Main')

watch(route, () => {
  selected.value = route.name
})

watch(selected, () => {
  router.push({name: selected.value})
})
</script>

<template>
  <a-layout>
    <a-side>
      <a-list-menu v-model="selected" :menu="menu"></a-list-menu>
    </a-side>
    <a-layout>
      <a-content class="main-content">
        <RouterView />
      </a-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}

.main-content {
  height: 100vh;
}

.a-side {
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: var(--scrollbar);
}
</style>
