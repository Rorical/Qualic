<script setup>
import { useDocumentStore } from "@/stores/document";
import {useRouter} from "vue-router";
const documentStore = useDocumentStore();
const router = useRouter()

const settings = {}
const localChar = localStorage.getItem("settings")
if (localChar) {
  Object.assign(settings, JSON.parse(localChar))
} else {
  router.push({name: "Settings"})
}

const emits = defineEmits(["selected"])

const systemPrompt = "# 背景信息:\n" + settings["@background"] + "\n\n# 角色列表:\n" + settings["@characters"]

const chatCompletion = async (prompt) => {
  const response = await fetch(settings.gptEndpoint + "v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + settings.gptApiKey
    },
    body: JSON.stringify({
      model: settings.gptModel,
      messages: [
        { role: 'system', content: systemPrompt + "\n\n# 对话内容:\n" + prompt + "\n\n"}
      ],
      temperature: parseFloat(settings.gptTemperature),
      stop: ['\n\n'],
      n: parseInt(settings.gptN),
    })
  })
  const data = await response.json()
  return data.choices.map(item => {
    const content = item.message.content
    const index = content.indexOf("\n")
    if (index != -1) {
      return {
        char: content.slice(1, index),
        content: content.slice(index + 1)
      }
    } else {
      return {
        char: "",
        content: content.slice(1)
      }
    }

  })
}

const suggestions = ref([])
const loading = ref(false)

const makeSuggestion = async () => {
  loading.value = true
  const result = await chatCompletion(documentStore.textDocumentSliced)
  loading.value = false
  suggestions.value = result
}

const confirmSuggestion = (item) => {
  emits("selected", item)
}
</script>

<template>
  <div class="completion-container">
    <div class="list-wrapper">
      <a-card v-for="item in suggestions" width="100%" @click="confirmSuggestion(item)">
        <b>{{ item.char }}</b> <a-split v-if="item.char != ''"></a-split> <p>{{ item.content }}</p>
      </a-card>
    </div>
    <a-button @click="makeSuggestion" :loading="loading">生成</a-button>
  </div>
</template>

<style lang="scss" scoped>
.completion-container {
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .list-wrapper {
    width: 100%;
    flex-grow: 1;
    overflow-y: auto;

    .a-card {
      margin-bottom: 10px;
    }
  }
}
</style>