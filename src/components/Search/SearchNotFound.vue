<template>
  <section class="w-full flex flex-col gap-4 justify-center items-center p-10">
    <img src="../../assets/images/image-search-not-found.png" class="w-[30%]" />
    <h1 class="font-semibold text-soft-blue text-xl">No Results Found for “{{ query }}”</h1>
    <p>Try creating the page of “{{ query }}” on this wiki to help others!</p>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const query = ref('')

watchEffect(() => {
  query.value = route.query.search
  console.log(query.value)
})
</script>
