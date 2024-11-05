<template>
  <div>
    <div
      v-if="showSuccessPopup || showErrorPopup"
      class="fixed inset-0 bg-primary-black bg-opacity-50 z-50 animate__animated animate__fadeIn"
    ></div>
    <SideForm router="/login">
      <RegisterForm @success="showSuccessPopup = true" @error="handleError" />
    </SideForm>
    <PopUpUnsuccessfull
      v-if="showErrorPopup"
      title="Error!"
      :message="formattedMessage(errors)"
      class="popup-center animate__animated animate__zoomIn"
    />
    <PopUpSuccessful
      v-if="showSuccessPopup"
      title="Selamat Datang!"
      message="Kamu berhasil membuat akun"
      class="popup-center animate__animated animate__zoomIn"
    />
  </div>
</template>

<script setup>
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import SideForm from '@/components/Auth/SideForm.vue'
import PopUpSuccessful from '@/components/widgets/PopUpSuccessful.vue'
import PopUpUnsuccessfull from '@/components/widgets/PopUpUnsuccessfull.vue'
import { formattedMessage } from '@/helpers/FormattedMessageError'
import { ref } from 'vue'

const showSuccessPopup = ref(false)
const showErrorPopup = ref(false)
const errors = ref({})

const handleError = (errorData) => {
  errors.value = errorData
  showErrorPopup.value = true
  setTimeout(() => {
    showErrorPopup.value = false
  }, 3000)
}
</script>

<style scoped>
.popup-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: scale-in-center 0.4s ease-out;
}
</style>
