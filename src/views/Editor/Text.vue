<script setup>
import { VAceEditor } from 'vue3-ace-editor'
import { useDocumentStore } from "@/stores/document"
import debounce from 'lodash.debounce'

const documentStore = useDocumentStore()

const content = ref('')

const scrollToBottom = () => {
  nextTick(() => {
    const editor = document.querySelector('.ace_editor')
    editor.scrollTop = editor.scrollHeight
  })
}

onMounted(() => {
  content.value = documentStore.textDocument
  scrollToBottom()
})

watch(content, debounce((value) => {
  documentStore.setTextDocument(value)
  documentStore.persist()
}, 500))
</script>

<template>
  <v-ace-editor v-model:value="content" theme="chaos" style="height: 100%"></v-ace-editor>
</template>

<style lang="scss" scoped>

</style>