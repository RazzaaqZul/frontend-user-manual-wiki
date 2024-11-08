<template>
  <section
    :class="[
      'w-[35%] h-[60vh] bg-white-background drop-shadow-2xl flex flex-col justify-center items-center rounded-3xl'
    ]"
  >
    <div class="w-full h-[60%] bg-red-error rounded-3xl flex justify-center items-center">
      <img src="../../assets/icon/icon-error.png" class="w-44 animate__animated animate__zoomIn" />
    </div>
    <div
      class="w-full h-[40%] bg-white-background rounded-3xl flex flex-col items-center gap-2 pt-5"
    >
      <h1 class="text-red-error font-bold text-3xl">{{ title }}</h1>
      <p class="text-center text-md mx-9">{{ message }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  status: Boolean
})
</script>

<style scoped>
/* Scoped styling if necessary */
</style>
