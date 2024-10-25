<template>
  <RouterLink to="/login">
    <button
      class="bg-white-background shadow-lg drop-shadow-lg w-fit flex justify-center items-center gap-3 rounded-3xl py-2 px-6 hover:scale-110 duration-150"
    >
      <div class="bg-gradient-color w-fit rounded-full p-2">
        <img src="`../assets/icon/icon-user.png`" :alt="'logo_user'" class="w-5" />
      </div>
      <h1 class="font-normal text-grey-word capitalize">{{ role ? role : 'Log In' }}</h1>
      <img src="`../assets/icon/icon-arrow-right.png`" :alt="'logo_user'" class="w-4" />
    </button>
  </RouterLink>
</template>

<script setup>
const tokenData = localStorage.getItem('user')
const tokenObject = JSON.parse(tokenData)
const role = tokenObject?.role
</script>
