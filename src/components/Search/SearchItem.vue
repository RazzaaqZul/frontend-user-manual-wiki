<template>
  <section class="">
    <div class="flex justify-start items-center gap-3 text-soft-blue">
      <h1>{{ data.title }}</h1>
      <p>/</p>
      <div v-for="(item, index) in data.content" :key="index" class="flex flex-col">
        <h1 class="text-red-custom">
          {{ item.title }}
        </h1>
        <div v-for="(heading2, index) in item.content" :key="index" class="flex flex-col">
          <h2 class="text-green-custom">{{ heading2.title }}</h2>
        </div>
      </div>
    </div>
    <!-- <p class="pl-5 text-justify">{{ paragraph }}</h2> -->
  </section>
</template>

<script setup>
const props = defineProps({
  data: Object
})

console.log(props.data)
</script>
