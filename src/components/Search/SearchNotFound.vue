<template>
  <section class="w-full flex flex-col gap-4 justify-center items-center p-10">
    <img src="../../assets/images/image-search-not-found.png" class="w-[30%]" />
    <h1 class="font-semibold text-soft-blue text-xl">
      Tidak Ada Hasil Ditemukan untuk “{{ query }}”
    </h1>
    <p>Coba buat halaman “{{ query }}” di wiki ini untuk membantu orang lain!</p>
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
