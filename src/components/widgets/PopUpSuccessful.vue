<template>
  <section
    :class="[
      'w-[80%] h-[50%] sm:w-[70%] md:w-[60%] md:h-[60%] lg:w-[35%] lg:h-[50%] bg-white-background drop-shadow-2xl flex flex-col justify-center items-center rounded-3xl'
    ]"
  >
    <div
      class="w-full h-[60%] bg-successfull-gradient rounded-3xl flex justify-center items-center"
    >
      <img
        src="../../assets/icon/icon-successfull.png"
        class="w-24 animate__animated animate__zoomIn"
      />
    </div>
    <div
      class="w-full h-[40%] bg-white-background rounded-3xl flex flex-col items-center gap-2 pt-5"
    >
      <h1 class="text-green-custom font-bold text-3xl">{{ title }}</h1>
      <p>{{ message }}</p>
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
