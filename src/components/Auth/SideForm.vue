<template>
  <section class="flex justify-center items-center h-screen">
    <div
      class="flex flex-col justify-center items-center shadow-2xl drop-shadow-2xl rounded-2xl h-[95%] w-[80%] gap-3"
    >
      <!-- BPJS Logo -->
      <div class="basis-[15%] flex justify-center items-center">
        <img
          src="../../assets/icon/logo-bpjamsostek-color.png"
          class="object-fill w-[25vw] lg:w-[15vw]"
        />
      </div>

      <!-- Form and Image Container -->
      <div class="flex justify-center items-center w-full gap-9 h-[100%] rounded-2xl basis-[85%]">
        <!-- Slot for Login or Register Form -->
        <slot></slot>

        <!-- Side Image Section -->
        <div class="w-[40%] h-full justify-between items-center hidden lg:flex">
          <div class="bg-grey-button opacity-40 h-[90%] rounded-2xl w-1"></div>

          <!-- Center the images within this relative container -->
          <div class="relative flex flex-col justify-center items-center w-[30vw]">
            <!-- Paper folder background -->
            <img
              src="../../assets/images/paper-folder.png"
              class="object-cover w-[19vw] absolute top-0 z-0 animate-shake-infinite"
            />

            <!-- Boy sitting on laptop -->
            <img src="../../assets/images/boy-sitting-full.png" class="relative z-10" />
          </div>
        </div>
      </div>
      <div class="absolute bg-gradient-color-card right-0 h-full rounded-2xl w-7"></div>
      <RouterLink :to="`${router}`">
        <button
          class="absolute p-3 shadow-xl bg-white-background rounded-full top-4 right-14 hover:scale-110 duration-300"
        >
          <img src="../../assets/icon/icon-x-blue.png" class="w-7" />
        </button>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  router: String
})
</script>
