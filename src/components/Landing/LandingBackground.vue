<template>
  <div class="h-[70vh] md:h-[38rem] xl:h-[85vh] z-10 flex flex-col relative w-full">
    <div class="bg-dark-blue w-full h-full flex-grow p-10 flex flex-col gap-8">
      <section class="flex justify-between items-center z-10">
        <img
          src="../../assets/icon/logo-bpjamsostek-white.png"
          alt="logobpjamsostek"
          class="w-40 md:w-52"
        />
        <ButtonLogin></ButtonLogin>
      </section>

      <section class="flex justify-center items-center">
        <div class="text-start sm:text-center">
          <h1 class="font-bold text-[20px] lg:text-[30px] text-white-background">
            Selamat Datang di MediaWiki
          </h1>
          <h2 class="font-light italic text-[18px] lg:text-[30px] text-white-background">
            Anda Cari, Kami Sediakan
          </h2>
        </div>
      </section>

      <!-- Shape Animation -->
      <div
        class="hidden lg:block bg-dark-yellow w-52 h-52 rounded-full top-[-90px] right-40 absolute z-0 animate-shake-infinite"
      ></div>
      <div
        class="hidden lg:block bg-dark-yellow w-40 h-40 rounded-full top-[-100px] left-[-60px] absolute z-0 animate-shake-infinite"
      ></div>
      <div
        class="hidden lg:block bg-soft-blue w-[400px] h-[400px] rounded-full bottom-[90px] left-[-100px] absolute z-0 animate-shake-infinite"
      ></div>
      <img
        src="../../assets/images/boy-sitting-laptop.png"
        alt="logobpjamsostek"
        class="absolute top-[11rem] md:top-[12rem] right-0 w-[300px] lg:w-[400px] z-10"
      />
    </div>

    <div class="bg-white-background w-full h-[30vh] z-20"></div>
  </div>
</template>

<script setup>
import ButtonLogin from './../ButtonLogin.vue'
</script>
