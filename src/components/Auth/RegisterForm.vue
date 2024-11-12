<template>
  <div class="w-[70%] sm:w-[80%] md:w-[70%] lg:w-[35%] relative h-full">
    <transition name="slide" mode="out-in" class="h-full">
      <section v-if="currentSlide === 1" :key="1">
        <div
          class="text-soft-blue text-2xl mb-2 font-semibold w-fit flex flex-col justify-center gap-4"
        >
          <h1>Create Account <span @click="handleNext()">(Step 1 of 2)</span></h1>
          <div class="flex justify-center items-center w-full gap-2">
            <div class="border-gradient w-full h-1"></div>
            <div class="border-grey w-full h-1 cursor-pointer" @click="handleNext()"></div>
          </div>
        </div>

        <form @submit.prevent="handleNext" class="flex flex-col gap-2">
          <div>
            <label>Username <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="username"
                v-model="input.username"
                type="text"
                placeholder="Enter your username"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.username?.[0]" :class="[errorStyle()]">{{
              errors?.username[0]
            }}</label>
          </div>
          <div>
            <label>Password <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="password"
                v-model="input.password"
                type="password"
                placeholder="Enter your password"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.password?.[0]" :class="[errorStyle()]">{{
              errors.password[0]
            }}</label>
          </div>
          <div>
            <label>Confirm Password <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="confirmPassword"
                v-model="input.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                @focus="clearError"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.confirmPassword?.[0]" :class="[errorStyle()]">{{
              errors.confirmPassword[0]
            }}</label>
          </div>
          <button
            type="submit"
            class="absolute bottom-[5%] bg-dark-blue text-white-background p-3 rounded-xl mt-5 w-full"
          >
            Next
          </button>
        </form>
      </section>
      <section v-else-if="currentSlide === 2" :key="2">
        <div
          class="text-soft-blue text-2xl mb-2 font-semibold w-fit flex flex-col justify-center gap-4"
        >
          <h1>Create Account <span @click="handleNext()">(Step 2 of 2)</span></h1>
          <div class="flex justify-center items-center w-full gap-2">
            <div class="border-grey w-full h-1 cursor-pointer" @click="handleNext()"></div>
            <div class="border-gradient w-full h-1"></div>
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
          <div>
            <label>Email Address <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="email"
                v-model="input.email"
                type="email"
                placeholder="Enter your email address"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.email?.[0]" :class="[errorStyle()]" cla>{{
              errors.email[0]
            }}</label>
          </div>
          <div>
            <label>Real Name <span class="text-red-custom font-extrabold">*</span></label>
            <div class="border-gradient">
              <input
                id="name"
                v-model="input.name"
                type="text"
                placeholder="Enter your name"
                :class="[inputStyle()]"
              />
            </div>
            <label v-if="errors?.name?.[0]" :class="[errorStyle()]">{{ errors.name[0] }}</label>
          </div>
          <button
            type="submit"
            class="absolute bottom-[5%] bg-dark-blue text-white-background p-3 rounded-xl w-full"
            :disabled="loading"
          >
            <template v-if="loading">
              <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="8"
                fill="transparent"
                animationDuration=".9s"
                aria-label="Custom ProgressSpinner"
              />
            </template>
            <template v-else> Create Account </template>
          </button>
        </form>
      </section>
    </transition>
  </div>
</template>
<script setup>
import { userRegister } from '@/services/modules/AuthService'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ProgressSpinner from 'primevue/progressspinner'

const input = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  name: ''
})

const errors = ref({})
const loading = ref(false)

const inputStyle = () =>
  'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full'
const errorStyle = () => 'text-red-custom animate__animated animate__fadeInDown'

const router = useRouter()
const currentSlide = ref(1)

const emit = defineEmits(['success', 'error'])

const handleSubmit = async () => {
  errors.value = {}
  if (input.value.password !== input.value.confirmPassword) {
    errors.value.confirmPassword = ['Passwords do not match']
    emit('error', errors.value)
    return
  }

  loading.value = true // Start loading
  try {
    const response = await userRegister(input.value)
    if (response.status === 400 && response.data?.errors) {
      errors.value = response.data.errors
      emit('error', errors.value)
    } else {
      errors.value = {} // Clear errors if successful
      emit('success')
      setTimeout(() => router.push('/login'), 3000)
    }
  } catch (err) {
    console.error('Error while registering:', err)
  } finally {
    loading.value = false // Stop loading
  }
}

const handleNext = () => {
  if (input.value.password !== input.value.confirmPassword) {
    errors.value.confirmPassword = ['Passwords do not match']
    return
  }
  currentSlide.value = currentSlide.value === 1 ? 2 : 1
}

const clearError = () => (errors.value = {})
</script>
<style scoped>
/* Slide Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Ensure content doesn't jump during transition */
section {
  position: absolute;
  width: 100%;
}
</style>
