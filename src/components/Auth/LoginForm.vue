<template>
  <form
    @submit.prevent="handleSubmit"
    class="w-[70%] sm:w-[80%] md:w-[70%] lg:w-[35%] animate__animated animate__fadeIn"
  >
    <!-- Welcome message -->
    <h2 class="text-2xl font-semibold text-soft-blue mb-6">Selamat Datang!</h2>

    <!-- email field -->
    <div class="mb-4 min-h-[6rem]">
      <label>Alamat Email <span class="text-red-custom font-extrabold">*</span></label>
      <div class="border-gradient">
        <input
          id="email"
          v-model="input.email"
          type="email"
          placeholder="Masukkan alamat Email"
          @focus="clearError"
          :class="[inputStyle()]"
        />
      </div>
      <p
        v-if="errors?.email?.[0]"
        class="text-red-custom text-md my-2 animate__animated animate__fadeInDown mx-[1rem]"
      >
        {{ errors?.email?.[0] }}
      </p>
    </div>

    <!-- Password field with show/hide icon -->
    <div class="mb-4 min-h-[6rem]">
      <label>Kata Sandi <span class="text-red-custom font-extrabold">*</span></label>
      <div class="border-gradient relative">
        <input
          id="password"
          v-model="input.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Masukkan kata sandi"
          @focus="clearError"
          :class="[inputStyle(), 'pr-12']"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          <img
            :src="showPassword ? eyesOpenIcon : eyesCloseIcon"
            alt="Toggle Password Visibility"
            class="cursor-pointer w-6 h-6"
            @click="togglePassword"
          />
        </div>
      </div>
      <p
        v-if="errors?.password?.[0]"
        class="text-red-custom text-md my-2 animate__animated animate__fadeInDown mx-[1rem]"
      >
        {{ errors?.password?.[0] }}
      </p>
      <p
        v-if="errors.message"
        class="text-red-custom text-md my-6 animate__animated animate__fadeInDown mx-[1rem]"
      >
        {{ errors.message }}
      </p>
    </div>

    <!-- Login button with loading spinner -->
    <div class="mb-4">
      <button
        type="submit"
        class="w-full bg-dark-blue h-[60px] text-white-background font-bold py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        :disabled="loading"
      >
        <template v-if="loading">
          <ProgressSpinner
            style="width: 25px; height: 25px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".9s"
            aria-label="Custom ProgressSpinner"
          />
        </template>
        <template v-else> Masuk </template>
      </button>
    </div>

    <!-- Sign Up link -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        Belum punya akun?
        <RouterLink to="/register"> <span class="text-soft-blue">Daftar</span> </RouterLink>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '../../services/modules/AuthService'
import ProgressSpinner from 'primevue/progressspinner'

// Icons for eyes open and eyes close
import eyesOpenIcon from './../../assets/icon/icon-eyes-open.png'
import eyesCloseIcon from './../../assets/icon/icon-eyes-close.png'

const emit = defineEmits(['success', 'error'])

const input = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null,
  message: null
})

const router = useRouter()
const loading = ref(false) // Loading state
const showPassword = ref(false) // Password visibility state

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  errors.value = { email: '', password: '', general: '' }
  loading.value = true // Start loading

  try {
    const response = await userLogin(input.value)

    if (response.status === 400 && response.data?.errors) {
      errors.value = response.data.errors || ['Unknown error occurred']
      emit('error', errors.value)
    } else if (response.status === 401) {
      errors.value.message = 'Email atau Kata Sandi salah'
      emit('error', errors.value)
    } else {
      errors.value = []
      emit('success')
      setTimeout(() => {
        router.push('/main')
      }, 3000)
    }
  } catch (err) {
    console.error('Error while logging in:', err)
  } finally {
    loading.value = false // End loading
  }
}

const inputStyle = () => {
  return 'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full'
}

const clearError = () => {
  errors.value.message = ''
  errors.value.email = ''
  errors.value.password = ''
}
</script>
<style scoped>
/* Tambahkan style untuk memastikan container input konsisten */
.border-gradient {
  position: relative;
  width: 100%;
}

/* Pastikan input memiliki ruang cukup untuk icon */
.border-gradient-inner {
  padding: 0.75rem 3rem 0.75rem 1rem;
}
</style>
