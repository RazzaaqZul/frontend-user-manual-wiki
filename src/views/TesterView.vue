<template>
  <div class="flex justify-center items-center h-[100vh]">
    <!-- Pop-up component for displaying error message -->
    <PopUpUnsuccessfull
      title="Error!"
      :status="false"
      :message="formattedMessage(errorMessage)"
      class="animate__animated animate__zoomIn"
    />
  </div>
</template>

<script setup>
// Uncomment if you need the successful popup
// import PopUpSuccessful from '@/components/widgets/PopUpSuccessful.vue'
import PopUpUnsuccessfull from '@/components/widgets/PopUpUnsuccessfull.vue'
import { formattedMessage } from '@/helpers/FormattedMessageError'

const errorMessage = {
  category: ['The category field is required.'],
  content: ['The content field is required.'],
  img: ['The img field is required.'],
  short_desc: ['The short desc field is required.'],
  title: ['The title field is required.'],
  version: ['The version field is required.']
}
</script>
