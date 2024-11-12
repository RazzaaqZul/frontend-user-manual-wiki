<template>
  {{ console.log(user_manual) }}
  <section
    class="hover:bg-grey-input duration-200 cursor-pointer p-2 rounded-xl w-full"
    @click="goToUserManual(searchResults)"
  >
    {{ console.log(searchResults) }}
    <div v-if="searchResults">
      <div class="flex justify-start items-center gap-2 text-soft-blue">
        <!-- Title with optional highlight -->
        <span v-html="highlightMatch(searchResults.title)" class="font-semibold"></span>

        <!-- Show hierarchy separators and headings only if they exist -->
        <template v-if="searchResults.h1">
          <div>/</div>
          <span v-html="highlightMatch(searchResults.h1)"></span>
        </template>

        <!-- Always show h2 if it exists -->
        <template v-if="searchResults.h2">
          <div>/</div>
          <span v-html="highlightMatch(searchResults.h2)"></span>
        </template>
      </div>

      <!-- Show matched content if it exists -->
      <p
        v-if="searchResults.content"
        v-html="highlightMatch(searchResults.content)"
        class="mt-2 ml-5 text-justify"
      ></p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  user_manual: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search-result'])

const route = useRoute()
const query = ref(route.query.search || '')

// Helper function to highlight matched text
function highlightMatch(text) {
  if (!text || !query.value) return text
  const regex = new RegExp(`(${query.value})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-custom">$1</span>')
}

// Helper function to get text content without HTML tags and img tags
function stripHtml(html) {
  // First, remove img tags completely
  const withoutImages = html.replace(/<img[^>]*>/g, '')

  const tmp = document.createElement('div')
  tmp.innerHTML = withoutImages
  return tmp.textContent || tmp.innerText || ''
}

// Helper function to get surrounding context (10 words before and after)
function getContextAround(text, searchTerm, wordCount = 10) {
  const words = text.split(/\s+/)
  const searchTermLower = searchTerm.toLowerCase()

  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().includes(searchTermLower)) {
      const start = Math.max(0, i - wordCount)
      const end = Math.min(words.length, i + wordCount + 1)

      let result = words.slice(start, end).join(' ')
      if (start > 0) result = '... ' + result
      if (end < words.length) result = result + ' ...'

      return result
    }
  }
  return text
}

// Helper function to find the closest h1 and h2 for an element
function findHeadings(element) {
  let h1 = null
  let h2 = null
  let currentElement = element

  // First, traverse up to find the closest list container (ul/ol) if element is a list item
  if (currentElement.tagName === 'LI') {
    currentElement = currentElement.parentElement
  }

  // Then traverse through previous siblings and their children
  while (currentElement) {
    if (currentElement.tagName === 'H1') {
      h1 = stripHtml(currentElement.innerHTML)
      break
    }
    if (currentElement.tagName === 'H2') {
      if (!h2) {
        h2 = stripHtml(currentElement.innerHTML)
      }
    }

    // If we haven't found both headings, keep looking in previous siblings
    if (!h1) {
      currentElement = currentElement.previousElementSibling
    } else {
      break
    }
  }

  // If we haven't found h1 yet, traverse up through parents
  if (!h1) {
    currentElement = element.parentElement
    while (currentElement) {
      const prevH1 = currentElement.querySelector('h1')
      const prevH2 = currentElement.querySelector('h2')

      if (prevH1) {
        h1 = stripHtml(prevH1.innerHTML)
        break
      }
      if (prevH2 && !h2) {
        h2 = stripHtml(prevH2.innerHTML)
      }
      currentElement = currentElement.parentElement
    }
  }

  return { h1, h2 }
}

const searchResults = computed(() => {
  if (!query.value) return null

  const parser = new DOMParser()
  const doc = parser.parseFromString(props.user_manual.content, 'text/html')

  const searchTerm = query.value.toLowerCase()
  const results = {
    title: null,
    h1: null,
    h2: null,
    content: null
  }

  // Check title match
  if (props.user_manual.title.toLowerCase().includes(searchTerm)) {
    results.title = props.user_manual.title
  }

  // Find matches in content
  const elements = doc.querySelectorAll('h1, h2, p, ul li, ol li')
  let matchFound = false

  for (const element of elements) {
    const text = stripHtml(element.innerHTML)

    if (text.toLowerCase().includes(searchTerm)) {
      matchFound = true

      if (element.tagName === 'P' || element.tagName === 'LI') {
        // Get context around the matched term
        results.content = getContextAround(text, searchTerm)

        // Find the correct headings
        const { h1, h2 } = findHeadings(element)
        results.h1 = h1
        results.h2 = h2

        // Break after finding first match in content
        break
      } else if (element.tagName === 'H1') {
        results.h1 = text
      } else if (element.tagName === 'H2') {
        results.h2 = text
        // If we match on h2, we need to find its parent h1
        const { h1 } = findHeadings(element)
        results.h1 = h1
      }
    }
  }

  // If no specific match was found in content but title matched
  if (!matchFound && !results.title) {
    emit('search-result', false)
    return null
  }

  // Always include title if we have any matches
  if (!results.title) {
    results.title = props.user_manual.title
  }

  emit('search-result', true)
  return results
})

// Watch for route changes
watchEffect(() => {
  query.value = route.query.search || ''
})

const router = useRouter()

function generateSlug(text) {
  if (!text) return ''
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}
// Method to navigate to the user manual
function goToUserManual(searchResults) {
  // Use h2 if available, otherwise fallback to h1
  const heading = searchResults.h2 || searchResults.h1
  console.log(heading)
  const slug = generateSlug(heading)
  router.push(`/main/user-manuals/${props.user_manual.user_manual_id}#${slug}`)
}
</script>
