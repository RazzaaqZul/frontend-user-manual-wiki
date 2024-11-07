<template>
  <RouterLink :to="`/main/user-manuals/${user_manual_id}`">
    <article
      class="flex items-center w-full h-full space-x-4 p-2 cursor-pointer hover:bg-grey-background duration-300"
    >
      <img :src="imageUrl" :alt="title" class="w-16 h-16 object-contain" />
      <div class="flex-1">
        <h1 class="text-sm line-clamp-2 font-semibold text-grey-word">{{ title }}</h1>
        <h2 class="text-sm line-clamp-2 text-grey-word">{{ short_desc }}</h2>
      </div>
    </article>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
// Mengambil props
const props = defineProps({
  user_manual_id: String,
  title: String,
  img: String,
  short_desc: String
})

// Membuat URL gambar
// const imageUrl = computed(() => new URL(`../../assets/icon/${props.img}`, import.meta.url).href)
const imageUrl = computed(() => `${import.meta.env.VITE_BASE_URL}/storage/${props.img}`)
</script>
