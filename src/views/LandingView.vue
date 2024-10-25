<script setup>
import FooterComponent from '@/components/FooterComponent.vue'
import LandingBackground from '@/components/Landing/LandingBackground.vue'
import LandingMenu from '@/components/Landing/LandingMenu.vue'
</script>

<template>
  <div class="bg-white-background flex flex-col min-h-screen relative">
    <LandingBackground></LandingBackground>

    <LandingMenu></LandingMenu>

    <footer class="mt-auto w-full">
      <FooterComponent />
    </footer>
  </div>
</template>
