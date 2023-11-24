<script setup>
import { useDocumentStore } from "@/stores/document"
import { message } from '@any-design/anyui'
import debounce from "lodash.debounce";
import {computed} from "vue";
import AutoComplete from "@/components/AutoComplete.vue";

const documentStore = useDocumentStore()

const statementList = computed(() => {
  return documentStore.listDocument.slice(-100)
})

const characters = ref([{text: "Narrator", value: "Narrator"}])
const loadCharacters = () => {
  const localChar = localStorage.getItem("settings")
  if (localChar) {
    characters.value = JSON.parse(localChar)["@characters"].split("\n").map((item, index) => {
      return {
        text: item,
        value: item,
      }
    }).concat({
      text: "Narrator",
      value: "Narrator"
    })
  }
}

const characterSelected = ref("")
const textInput = ref("")

const vlist = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    vlist.value.scrollTo(0, vlist.value.scrollHeight)
  })
}

const submit = () => {
  if (textInput.value == "") {
    message({
      type: 'warning',
      content: 'Please input something!'
    })
    return
  }
  documentStore.addStatement({
    char: (characterSelected.value != "Narrator" ? characterSelected.value : ""),
    content: textInput.value
  })
  textInput.value = ""
  scrollToBottom()
}

onMounted(() => {
  scrollToBottom()
  loadCharacters()
  characterSelected.value = "Narrator"
})

watch(documentStore.listDocument, () => {
  debounce(() => {
    documentStore.persist()
  }, 2000)()
})

const updateSelected = (item) => {
  textInput.value = item.content
  characterSelected.value = item.char
}
</script>

<template>
  <div class="editor-container">
    <div class="main-container">
      <div class="list-container" ref="vlist">
        <a-card width="100%" v-for="item in statementList">
          <b>{{ item.char }}</b> <a-split v-if="item.char != ''"></a-split> <p>{{ item.content }}</p>
        </a-card>
      </div>
      <div class="input-container">
        <a-textarea :minRows="2" :maxRows="2" disableResizeCorner v-model="textInput" placeholder="XD" @keydown.ctrl.enter="submit"></a-textarea>
        <div class="inputs">
          <a-select :items="characters" v-model="characterSelected"></a-select>
          <a-button type="gradient" @click="submit">Ok!</a-button>
        </div>
      </div>
    </div>
    <div class="side-container">
      <AutoComplete @selected="updateSelected"></AutoComplete>
    </div>
  </div>
</template>

<style lang="scss">
.editor-container{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  box-sizing: border-box;

  .main-container {
    position: relative;
    height: 100%;
    flex-grow: 1;

    .input-container {
      position: relative;

      &::before {
        position: absolute;
        content: '';
        top: -17px;
        left: 0;
        right: 0;
        width: 100%;
        height: 17px;
        backdrop-filter: blur(10px);
        z-index: 10;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg));
      }
      box-sizing: border-box;
      height: 8rem;
      width: 100%;

      .a-textarea {
        .a-textarea__inner {
          font-size: large;
        }
      }

      .inputs {
        margin-top: 3px;
        display: flex;

        .a-button {
          margin-left: 5px;
        }
      }
    }

    .list-container{
      height: calc(100vh - 8rem);
      overflow-y: auto;
      box-sizing: border-box;
      padding-bottom: 10px;
      width: 100%;
      position: relative;
      .a-card {
        margin-bottom: 10px;
      }
      .card-container {
        margin: auto;
        p {
          white-space: pre;
        }
      }

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-button {
        display: none;
      }

      &::-webkit-scrollbar-thumb {
        width: 6px;
        border-radius: 6px;
        background: var(--scrollbar);
      }

      &::-webkit-scrollbar-track {
        background: var(--bg);
      }

      &::-webkit-scrollbar-corner {
        background: var(--bg);
      }
    }
  }

  .side-container {
    width: 300px;
    height: 100%;
    background: var(--bg);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

}
</style>