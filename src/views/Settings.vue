<script setup>
import { useDocumentStore } from "@/stores/document";
const documentStore = useDocumentStore();

const settings = ref({
  "gptEndpoint": "https://api.openai.com/",
  "gptApiKey": "",
  "gptModel": "gpt-3.5-turbo",
  "gptTemperature": "0.7",
  "gptN": "5",
  "@background": "",
  "@characters": "",
});

onMounted(() => {
  const loadedSettings = localStorage.getItem("settings");
  if (loadedSettings) {
    Object.assign(settings.value, JSON.parse(loadedSettings));
  }
});

const save = () => {
  localStorage.setItem("settings", JSON.stringify(toValue(settings)));
};
</script>

<template>
  <div class="container">
    <div class="blocks">
      <div class="block" v-for="(_, i) in settings">
        <div class="title">{{ i }}</div>
        <div class="content">
          <a-textarea v-if="i.startsWith('@')" v-model="settings[i]"></a-textarea>
          <a-input v-else v-model="settings[i]"></a-input>
        </div>
      </div>
    </div>
    <a-button @click="save">Save</a-button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 50%;
  margin: 0 auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;

  .blocks {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .block {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .title {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        .ant-input {
          width: 100%;
        }
      }
    }
  }
}
</style>