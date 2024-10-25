<template>
  <div class="px-[15%]">
    <NavbarComponent />
    <h2 class="text-2xl font-bold text-soft-blue border-b-4 border-grey-input py-5 mb-5">
      Create User Manual
    </h2>
    <FormUserManualLayout :form="form" @update:form="updateForm" />
  </div>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import FormUserManualLayout from '../layouts/FormUserManualLayout.vue'
import { ref } from 'vue'

// Define the empty form state
const form = ref({
  title: '',
  img: '',
  short_desc: '',
  initial_editor: null,
  latest_editor: '',
  version: '',
  content: '',
  category: '',
  size: '20MB',
  user_id: null // Set to null or default user ID if available
})

// Method to update the form state
const updateForm = (updatedForm) => {
  form.value = updatedForm
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
