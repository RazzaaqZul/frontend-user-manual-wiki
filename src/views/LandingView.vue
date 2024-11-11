<script setup>
import FooterComponent from '@/components/FooterComponent.vue'
import LandingBackground from '@/components/Landing/LandingBackground.vue'
import LandingMenu from '@/components/Landing/LandingMenu.vue'
</script>

<template>
  <section
    class="flex flex-col justify-center items-center gap-[41rem] sm:gap-[23rem] md:gap-[120px] overflow-hidden w-full h-full"
  >
    <div class="bg-white-background flex flex-col relative w-full">
      <LandingBackground />
      <LandingMenu />
    </div>
    <footer class="w-full h-full bg-red-custom">
      <FooterComponent />
    </footer>
  </section>
</template>
