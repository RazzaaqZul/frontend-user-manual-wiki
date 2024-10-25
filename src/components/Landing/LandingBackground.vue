<template>
  <div class="h-screen z-10 bg-green-custom flex flex-col relative">
    <div class="bg-dark-blue w-full flex-grow p-10 flex flex-col gap-8">
      <section class="flex justify-between items-center z-10">
        <img
          src="../../assets/icon/logo-bpjamsostek-white.png"
          alt="logobpjamsostek"
          class="w-52"
        />
        <ButtonLogin></ButtonLogin>
      </section>

      <section class="flex justify-center items-center">
        <div class="text-center">
          <h1 class="font-bold text-[40px] text-white-background">Selamat Datang di MediaWiki</h1>
          <h2 class="font-light italic text-[30px] text-white-background">
            Anda Cari, Kami Sediakan
          </h2>
        </div>
      </section>

      <!-- Shape Animation -->
      <div
        class="bg-dark-yellow w-52 h-52 rounded-full top-[-90px] right-40 absolute z-0 animate-shake-infinite"
      ></div>
      <div
        class="bg-dark-yellow w-40 h-40 rounded-full top-[-100px] left-[-60px] absolute z-0 animate-shake-infinite"
      ></div>
      <div
        class="bg-soft-blue w-[400px] h-[400px] rounded-full bottom-[90px] left-[-100px] absolute z-0 animate-shake-infinite"
      ></div>
      <img
        src="../../assets/images/boy-sitting-laptop.png"
        alt="logobpjamsostek"
        class="absolute top-28 right-3 w-[500px] z-10"
      />
    </div>

    <div class="bg-white-background w-full h-[30%] z-20"></div>
  </div>
</template>

<script setup>
import ButtonLogin from './../ButtonLogin.vue'
</script>
