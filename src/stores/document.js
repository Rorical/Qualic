import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('document', () => {
  const documentList = ref([])

  // automatically persist the store into localStorage
  function persist() {
    localStorage.setItem('document', JSON.stringify(documentList.value))
  }

  function read() {
    const json = localStorage.getItem('document')
    if (json) {
      documentList.value = JSON.parse(json)
    } else {
      persist()
    }
  }

  const documentText2List = (text) => {
    const statements = text.split("\n\n")
    const statementList = statements.map(statement => {
      const first = statement.split("\n")[0]
      if (first.startsWith("@")) {
        return {
          char: first.substring(1),
          content: statement.substring(first.length + 1)
        }
      } else {
        return {
          char: "",
          content: statement
        }
      }
    })
    return statementList
  }

  const documentList2Text = (list) => {
    const text = list.map(statement => {
      if (statement.char) {
        return `@${statement.char}\n${statement.content}`
      } else {
        return statement.content
      }
    }).join("\n\n")
    return text
  }

  const textDocument = computed(() => {
    return documentList2Text(documentList.value)
  })

  const textDocumentSliced = computed(() => {
    return documentList2Text(documentList.value.slice(-100))
  })

  const listDocument = computed(() => {
    return documentList.value
  })

  function setTextDocument(text) {
    documentList.value = documentText2List(text)
  }

  function setListDocument(list) {
    documentList.value = list
  }

  function addStatement(statement) {
    documentList.value.push(statement)
  }

  function removeStatement(index) {
    documentList.value.splice(index, 1)
  }

  function updateStatement(index, statement) {
    documentList.value[index] = statement
  }

  function moveStatement(from, to) {
    const statement = documentList.value[from]
    documentList.value.splice(from, 1)
    documentList.value.splice(to, 0, statement)
  }

  function clearDocument() {
    documentList.value = []
  }

  function getStatement(index) {
    return documentList.value[index]
  }

  function getStatementCount() {
    return documentList.value.length
  }

  function removeLastStatement() {
    documentList.value.pop()
  }

  read()

  return {
    documentList,
    persist,
    read,
    textDocument,
    textDocumentSliced,
    listDocument,
    setTextDocument,
    setListDocument,
    addStatement,
    removeStatement,
    updateStatement,
    moveStatement,
    clearDocument,
    getStatement,
    getStatementCount,
    removeLastStatement,
  }
})
