<template>
  <div>
    <SideForm router="/">
      <LoginForm />
    </SideForm>
  </div>
</template>

<script setup>
import SideForm from '@/components/Auth/SideForm.vue'
import LoginForm from '../components/Auth/LoginForm.vue'
</script>
