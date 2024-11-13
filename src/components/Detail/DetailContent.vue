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
// Computed property to format the HTML content
const formattedContent = computed(() => {
  if (!props.content) return ''

  let content = props.content
  const h2Counts = {} // Menyimpan jumlah kemunculan untuk setiap <h2>

  content = content
    .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
    .replace(/<h1[^>]*>(\s*|<br\s*\/?>)<\/h1>/g, '')
    .replace(/<h2[^>]*>(\s*|<br\s*\/?>)<\/h2>/g, '')
    .replace(/<p[^>]*>(\s*|<br\s*\/?>)<\/p>/g, '')

  content = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, (match, p1) => {
      let id = p1
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;$/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '')

      // Jika ID hanya berupa angka, ubah menjadi null
      if (/^\d+$/.test(id)) id = null

      return `<h1 id="${id || ''}" class=" text-[15px] md:text-[25px] lg:text-2xl text-soft-blue p-1 border-b-2 border-b-grey-background my-10">${p1.replace(/<(strong|em)[^>]*>(.*?)<\/\1>/g, '$2').trim()}</h1>`
    })
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, (match, p1) => {
      let id = p1
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;$/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '')

      // Jika ID hanya berupa angka, ubah menjadi null
      if (/^\d+$/.test(id)) id = null

      // Periksa apakah id sudah ada di h2Counts dan tambahkan angka hanya jika id bukan null
      if (id && h2Counts[id]) {
        h2Counts[id] += 1
        id = `${id}-${h2Counts[id]}`
      } else if (id) {
        h2Counts[id] = 1
      }

      return `<h2 id="${id || ''}" class="text-[12px] md:text-[20px] lg:text-xl text-soft-blue my-3">${p1.replace(/<(strong|em)[^>]*>(.*?)<\/\1>/g, '$2').trim()}</h2>`
    })

  content = content
    .replace(/<p[^>]*>(.*?)<\/p>/g, '<p class="text-[10px] md:text-[15px] lg:text-md my-5">$1</p>')
    .replace(
      /<ol[^>]*>(.*?)<\/ol>/g,
      '<ol class="text-[10px] md:text-[15px] list-decimal pl-5 mx-10">$1</ol>'
    )
    .replace(
      /<ul[^>]*>(.*?)<\/ul>/g,
      '<ul class="text-[10px] md:text-[15px] list-disc my-2 mx-10">$1</ul>'
    )
    .replace(
      /<a([^>]*)>(.*?)<\/a>/g,
      '<a$1 class="text-[10px] md:text-[15px] text-soft-blue">$2</a>'
    )
    .replace(/<li[^>]*>(.*?)<\/li>/g, '<li class="text-[10px] md:text-[15px] text-md">$1</li>')
    .replace(
      /<img[^>]*src="([^"]*)"[^>]*\/?>/g,
      '<img src="$1" class="my-5 mx-auto  rounded-[2%] h-auto" alt="Image" />'
    )
    .replace(/<[^/>]+><\/[^>]+>/g, '')

  return content
})
</script>
