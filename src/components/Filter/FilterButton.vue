<template>
  <div
    class="flex justify-center items-center border-2 border-soft-blue py-1 px-4 rounded-md gap-1 hover:scale-105 duration-200"
  >
    <img src="../../assets/icon/icon-filter.png" class="w-7 basis-1/4" />
    <h2 class="text-center font-semibold text-sm text-soft-blue basis-3/4">{{ label }}</h2>
  </div>
</template>

<script setup>
defineProps({
  label: String
})
</script>
