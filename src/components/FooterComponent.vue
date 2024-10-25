<template class="mt-auto w-full">
  <div class="w-full h-full bg-dark-blue flex justify-center gap-20 py-9">
    <!-- Footer Left -->
    <section class="flex flex-col gap-3">
      <img src="`../assets/icon/logo-callcenter.png`" class="w-32" />
      <h2 class="font-semibold text-yellow-custom">Ikuti Kami</h2>
      <div class="flex gap-2">
        <div v-for="media in dataMediaSocial" :key="media.name">
          <a :href="media.link" target="_blank">
            <img
              :src="getImageUrl(media.img)"
              :alt="media.name"
              class="w-7 hover:scale-110 rounded-full hover:bg-soft-blue duration-300"
            />
          </a>
        </div>
      </div>
    </section>
    <!-- Footer Right -->
    <section v-for="section in dataFooter" :key="section.title">
      <h3 class="text-yellow-custom font-semibold">
        {{ section.title }}
      </h3>
      <ul class="flex flex-col gap-[4px]">
        <li
          v-for="item in section.subtitle"
          :key="item.name"
          class="text-white-background text-sm hover:text-dark-yellow duration-150"
        >
          <a :href="item.link">{{ item.name }}</a>
        </li>
      </ul>
    </section>
    <div></div>
  </div>
</template>

<script setup>
import { dataFooter, dataMediaSocial } from '@/api/footer'

const getImageUrl = (img) => {
  return new URL(`../assets/icon/${img}`, import.meta.url).href
}
</script>
