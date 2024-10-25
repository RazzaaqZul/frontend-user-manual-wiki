<template>
  <section class="flex justify-between gap-[8%] w-full items-center py-8 ]">
    <!-- button sidebar -->
    <RouterLink to="/main">
      <img src="../assets/icon/logo-bpjamsostek-color.png" class="w-44" />
    </RouterLink>

    <!-- fitur search -->
    <!-- <SearchBar class="basis-[65%]" /> -->

    <!-- login button -->
    <ButtonLogin />
  </section>
</template>

<script setup>
import ButtonLogin from './ButtonLogin.vue'
// import SearchBar from './Search/SearchBar.vue'
</script>
