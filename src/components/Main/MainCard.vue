<template>
  <RouterLink :to="`/main/user-manuals/${user_manual_id}`">
    <section
      class="hover:bg-gradient-color-card rounded-xl w-[300px] md:w-[280px] lg:w-[261px] xl:w-[300px] h-[180px] p-10 hover:text-white-background gap-3 duration-300 border-[1px] shadow-lg text-blue-button relative"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="flex justify-between items-center gap-4 h-[100%]">
        <div :class="[isHovered ? 'text-white-background' : 'text-soft-blue', 'duration-300']">
          <h2 class="text-sm line-clamp-2 font-bold mb-2">{{ title }}</h2>
          <h3 class="text-sm line-clamp-2">{{ short_desc }}</h3>
        </div>
        <!-- Menggunakan computed property imageUrl sebagai sumber gambar -->
        <img :src="imageUrl" :alt="title" class="w-16 h-16 object-contain" />
      </div>

      <!-- Gambar yang berubah berdasarkan status hover -->
      <img
        :src="isHovered ? nextIconWhite : nextIconGradient"
        :class="isHovered ? `w-2 absolute right-4` : `w-4 absolute right-4`"
      />
    </section>
  </RouterLink>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  user_manual_id: String,
  title: String,
  img: String,
  short_desc: String
})

// Compute the main image URL
const imageUrl = computed(() => `${import.meta.env.VITE_BASE_URL}/storage/${props.img}`)
console.log(imageUrl.value)

// Reactive property to track hover state
const isHovered = ref(false)

// Paths for both icons
const nextIconGradient = new URL('../../assets/icon/icon-next-gradient.png', import.meta.url).href
const nextIconWhite = new URL('../../assets/icon/icon-next-white.png', import.meta.url).href
</script>
