<template>
  <div v-if="content">
    <!-- Render the content with the injected classes -->
    <div v-html="formattedContent"></div>
  </div>
  <div v-else>Loading content...</div>
</template>

<script setup>
import { computed } from 'vue'

// Define the props with the content string
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// Computed property to format the HTML content
const formattedContent = computed(() => {
  if (!props.content) return ''

  // Add Tailwind classes to the HTML content
  let content = props.content

  // Remove <span> tags but keep their innerHTML
  content = content.replace(/<span[^>]*>(.*?)<\/span>/g, '$1')

  // Remove empty <h1>, <h2>, and <p> tags or tags with only <br>
  content = content
    .replace(/<h1[^>]*>(\s*|<br\s*\/?>)<\/h1>/g, '') // Match empty <h1> tags
    .replace(/<h2[^>]*>(\s*|<br\s*\/?>)<\/h2>/g, '') // Match empty <h2> tags
    .replace(/<p[^>]*>(\s*|<br\s*\/?>)<\/p>/g, '') // Match empty <p> tags

  // Remove <strong> and <em> tags inside <h1> and <h2>
  content = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, (match, p1) => {
      // Create an ID from the inner HTML, stripping tags and handling &nbsp;
      const id = p1
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/&nbsp;$/g, '') // Remove &nbsp; only if it's at the end of the word
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with a space if in the middle
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase() // Convert to lowercase

      return `<h1 id="${id}" class="text-2xl text-soft-blue p-1 border-b-2 border-b-grey-background my-10">${p1.replace(/<(strong|em)[^>]*>(.*?)<\/\1>/g, '$2').trim()}</h1>`
    })
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, (match, p1) => {
      // Create an ID from the inner HTML, stripping tags and handling &nbsp;
      const id = p1
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/&nbsp;$/g, '') // Remove &nbsp; only if it's at the end of the word
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with a space if in the middle
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase() // Convert to lowercase

      return `<h2 id="${id}" class="text-xl text-soft-blue my-3">${p1.replace(/<(strong|em)[^>]*>(.*?)<\/\1>/g, '$2').trim()}</h2>`
    })

  // Replace <p> tags and handle lists
  content = content
    .replace(/<p[^>]*>(.*?)<\/p>/g, '<p class="text-md my-5">$1</p>') // For <p>
    .replace(/<ol[^>]*>(.*?)<\/ol>/g, '<ol class="list-decimal pl-5 mx-10">$1</ol>') // For <ol>
    .replace(/<ul[^>]*>(.*?)<\/ul>/g, '<ul class="list-disc my-2 mx-10">$1</ul>') // For <ul>
    .replace(/<a([^>]*)>(.*?)<\/a>/g, '<a$1 class="text-soft-blue">$2</a>') // For <a>
    .replace(/<li[^>]*>(.*?)<\/li>/g, '<li class="text-md">$1</li>') // For <li>

  // Add Tailwind classes to <img> tags
  content = content.replace(
    /<img[^>]*src="([^"]*)"[^>]*\/?>/g,
    '<img src="$1" class="my-5 mx-auto max-w-[40%] rounded-[2%] h-auto" alt="Image" />'
  )

  // Remove empty tags
  content = content.replace(/<[^/>]+><\/[^>]+>/g, '')

  console.log(content)
  return content
})
</script>
