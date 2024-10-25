<template>
  <div class="flex flex-col w-full h-[50vh] mb-5">
    <QuillEditor
      ref="quillEditor"
      theme="snow"
      v-model="localContent"
      :toolbar="[
        [{ header: [1, 2, false] }], // Heading 1, Heading 2, and default text
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ]"
      @textChange="handleTextChange"
      @ready="handleDefaultValue"
    ></QuillEditor>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { QuillEditor } from '@vueup/vue-quill'

const props = defineProps({
  form: Object
})

const quillEditor = ref(null)

// Emit changes to the parent
const emit = defineEmits(['update:form'])

// Function to handle text changes in the editor
const handleTextChange = () => {
  const quill = quillEditor.value.getQuill() // Get Quill instance
  const quillHTML = quill.root.innerHTML // Get HTML directly from the root

  const sanitizedContent = sanitizeContent(quillHTML)

  // Only update if the sanitized content is different from the form content
  if (sanitizedContent !== props.form.content) {
    emit('update:form', { ...props.form, content: sanitizedContent })
    console.log('Content updated:', sanitizedContent)
  }
}

// Function to handle setting default value on editor ready
const handleDefaultValue = () => {
  const quill = quillEditor.value.getQuill()

  // Only paste the HTML if there's content to be loaded
  if (props.form.content) {
    quill.pasteHTML(props.form.content, 'api')
  }
}

// Create a local state for content and initialize it with the form's content
const localContent = ref(props.form.content || '')

// Watch for changes in the form content and update the editor if necessary
watch(
  () => props.form.content,
  (newContent) => {
    const quill = quillEditor.value.getQuill()

    // If the new content is different from the editor's current content, update it
    if (newContent && quill.root.innerHTML !== newContent) {
      quill.pasteHTML(newContent, 'silent')
    }
  }
)

// Function to sanitize content by removing style attributes
function sanitizeContent(html) {
  if (!html) return ''

  // Create a temporary element
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Remove all style attributes from all elements
  const allElements = temp.getElementsByTagName('*')
  for (let i = 0; i < allElements.length; i++) {
    allElements[i].removeAttribute('style')
  }

  // Return the sanitized HTML
  return temp.innerHTML
}
</script>
