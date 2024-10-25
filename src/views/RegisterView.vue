<template>
  <div>
    <SideForm router="/login"><RegisterForm /> </SideForm>
  </div>
</template>

<script setup>
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import SideForm from '@/components/Auth/SideForm.vue'
</script>
