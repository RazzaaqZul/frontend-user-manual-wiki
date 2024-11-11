<template>
  <button
    :class="`${color} ${border}  ${text} px-4 py-3 rounded-[10px] w-fit flex justify-center items-center gap-3 hover:bg-dark-blue duration-300 hover:text-white-background hover:opacity-80`"
  >
    <img v-if="icon" :src="getImageUrl(icon)" class="w-6" />
    <h2 class="text-sm md:text-lg font-semibold">{{ name }}</h2>
  </button>
</template>

<script setup>
defineProps({
  color: String,
  name: String,
  icon: String,
  border: String,
  text: String
})

const getImageUrl = (name, type) => {
  if (type == 'image') {
    return new URL(`../assets/image/${name}`, import.meta.url).href
  } else {
    return new URL(`../assets/icon/${name}`, import.meta.url).href
  }
}
</script>
