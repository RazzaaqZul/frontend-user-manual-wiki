<template>
  <div class="w-full h-fit md:h-[700px] xl:h-[100vh] bg-dark-blue px-4 py-6 md:py-9">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-8 md:gap-20">
      <!-- Footer Left -->
      <section class="flex flex-col gap-3 items-center md:items-start">
        <img src="`../assets/icon/logo-callcenter.png`" class="w-24 sm:w-28 md:w-32" />
        <h2 class="font-semibold text-yellow-custom text-center md:text-left">Ikuti Kami</h2>
        <div class="flex gap-2 justify-center md:justify-start">
          <div v-for="media in dataMediaSocial" :key="media.name">
            <a :href="media.link" target="_blank">
              <img
                :src="getImageUrl(media.img)"
                :alt="media.name"
                class="w-6 sm:w-7 hover:scale-110 rounded-full hover:bg-soft-blue duration-300"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Footer Right -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-20">
        <section v-for="section in dataFooter" :key="section.title">
          <h3 class="text-yellow-custom font-semibold text-sm md:text-base text-left md:text-left">
            {{ section.title }}
          </h3>
          <ul class="flex flex-col gap-[4px] mt-2">
            <li
              v-for="item in section.subtitle"
              :key="item.name"
              class="text-white-background text-xs md:text-sm hover:text-dark-yellow duration-150 text-left md:text-left"
            >
              <a :href="item.link">{{ item.name }}</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dataFooter, dataMediaSocial } from '@/api/footer'

const getImageUrl = (img) => {
  return new URL(`../assets/icon/${img}`, import.meta.url).href
}
</script>
