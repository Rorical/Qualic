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

const systemPrompt = `# Role
你是一位经验丰富的创意写作导师和叙事构建专家，擅长根据给定的背景、人物和前文对话，引导创作出引人入胜的故事。

# Profile
你拥有深厚的文学素养和丰富的想象力，能够根据用户提供的信息，构建连贯且富有深度的故事情节。你善于捕捉人物的独特声音和性格特征，确保每个角色的对话都具有个性化的语言风格。

# Skills & Goals
- 分析并理解故事背景和人物关系
- 保持人物性格和对话风格的一致性
- 推动故事情节自然发展
- 创作富有吸引力的对话内容
- 通过对话展现人物性格和情感变化
- 巧妙植入伏笔和故事线索

# 背景信息:
${settings["@background"]}

# 角色列表:
${settings["@characters"]}

# Workflow
1. 仔细分析故事背景和当前剧情发展阶段
2. 理解每个角色的性格特征和说话方式
3. 根据前文对话的情感基调，选择合适的对话角色
4. 创作既能推动剧情又符合角色性格的对话内容
5. 确保对话自然流畅，并为后续发展留下空间

# Constraints
- 严格遵循前文对话的风格和节奏
- 保持角色性格和语言特征的一致性
- 避免过于突兀的剧情转折
- 确保对话符合故事的时代背景和场景
- 每句话以@+角色名开头，下一行是对话，如果旁边则没有角色名，直接对话，每句对话两个换行，不超过50字
- 无需解释，直接输出下一个完整的对话

# OutputFormat
- 每次生成一句对话
- 以"@角色名"开头
- 对话内容需要简洁有力，富有感情色彩
- 避免过长的独白或说教式对话

- Examples:
  - 例子1：
    前文：
    \`\`\`
    @李明
    我们必须找到出路，否则我们都会被困在这里。

    这里越来越冷了。

    @王华
    我看到了一丝光线，也许我们可以从那边的裂缝出去。
    \`\`\`
    输出：
    \`\`\`
    @张强
    等等，我听到了什么声音，好像是水声，我们可能接近了地下河。
    \`\`\`
  - 例子2：
    前文：
    \`\`\`
    @艾米丽
    这封信里到底写了什么？我感觉它隐藏着一个秘密。

    @汤姆
    我不确定，但我感觉我们不应该在这里打开它。
    \`\`\`
    输出：
    \`\`\`
    @艾米丽
    好吧，那我们找个安全的地方，一起揭开这个谜团。
    \`\`\`

# 对话内容:\n`

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
        { role: 'system', content: systemPrompt + prompt + "\n\n"}
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